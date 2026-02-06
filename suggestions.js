function applySuggestions(questions, suggestion) {
  if (questions[0].name == "type") {
    questions[0].default = findChoicesIndexByName(
      questions[0].choices,
      suggestion.type,
    );
  }

  if (questions[0].name == "subject") {
    questions[0].default = suggestion.subject;
  }

  return questions;
}

async function getSuggestion(types, config) {
  try {
    console.log(
      "Generating suggestion, Please wait...\nIf you don't require suggestion, run with SUGGESTION=false env arg.\n",
    );

    const llmConfig = getValidLlmConfig(config);
    const prompt = buildPrompt(getGitDiff(), types);
    const result =
      llmConfig.provider == "gemini"
        ? await getSuggestionWithGemini(prompt, llmConfig)
        : await getSuggestionWithOllama(prompt, llmConfig);

    const suggestionSplitted = result.split(": ");

    return { type: suggestionSplitted[0], subject: suggestionSplitted[1] };
  } catch (e) {
    console.log("Could not generate suggestion. Error: " + e.message + "\n");
  }

  return undefined;
}

function getValidLlmConfig(config) {
  if (!Object.hasOwn(config, "llm")) {
    throw new Error("No llm config found.");
  }

  const llmConfig = config.llm;

  if (
    !Object.hasOwn(llmConfig, "provider") ||
    !["ollama", "gemini"].includes(llmConfig.provider)
  ) {
    throw new Error(
      "No valid llm provider found. Only supported providers are: 'ollama', 'gemini'",
    );
  }

  return llmConfig;
}

async function getSuggestionWithGemini(prompt, llmConfig) {
  if (!Object.hasOwn(llmConfig, "apiKey") || !llmConfig.apiKey) {
    throw new Error("Api key is required to generate suggestion with gemini.");
  }

  const { GoogleGenAI } = require("@google/genai");

  const ai = new GoogleGenAI({
    apiKey: llmConfig.apiKey,
  });

  const response = await ai.models.generateContent({
    model: llmConfig.model,
    contents: prompt,
  });

  return response.text;
}

async function getSuggestionWithOllama(prompt, llmConfig) {
  

  const { Ollama } = require("ollama");

  const ollama = new Ollama({
    host: Object.hasOwn(llmConfig, "ollamaUrl")
      ? llmConfig.ollamaUrl
      : undefined,
    headers: Object.hasOwn(llmConfig, "apiKey")
      ? { Authorization: "Bearer " + llmConfig.apiKey }
      : undefined,
    
  });

  if (!Object.hasOwn(llmConfig, "model") || !llmConfig.model) {
    throw new Error("ollama model not configured.");
  }

  const response = await ollama.chat({
    model: llmConfig.model,
    keep_alive: -1,
    messages: [{ role: "user", content: prompt }],
  });

  return response.message.content;
}

function getGitDiff() {
  const { execSync } = require("child_process");

  const diff = execSync("git diff --staged", {
    encoding: "utf-8",
  });

  if (!diff) {
    throw new Error("No staged changes");
  }

  return diff;
}

function buildPrompt(diff, types) {
  return `You are a senior software engineer writing Git commit messages.

Task:
Generate a single-line Git commit message in the exact format:

TYPE: message

Rules (must follow all):
- TYPE must be chosen ONLY from the provided list of types
- Use exactly one TYPE (uppercase)
- Message must be in imperative mood (e.g., "add", "fix", "update", not "added" or "adds")
- Message must clearly describe what the change does, not how
- Total length (TYPE + colon + space + message) must be ≤ 76 characters
- No emojis
- No markdown
- No quotes
- No trailing punctuation
- Do not include scope unless explicitly instructed
- Output ONLY the commit message, nothing else

Allowed TYPES:
${types.map((t) => t.name).join(",")}

Input (git diff):
${diff}
`;
}

function findChoicesIndexByName(choices, startName) {
  const index = choices.findIndex((c) => c.value.name === startName);

  if (index === -1) return 0;

  return index;
}

module.exports = {
  apply: applySuggestions,
  get: getSuggestion,
};

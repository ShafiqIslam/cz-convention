function applySuggestions(questions, suggestion) {
  if (questions[0].name == "type") {
    questions[0].default = findChoicesIndexByName(questions[0].choices, suggestion.type);
  }

  if (questions[0].name == "subject") {
    questions[0].default = suggestion.subject;
  }

  return questions;
}

async function getSuggestion(types) {
  try {
    console.log(
      "Generating suggestion, Please wait...\nIf you don't require suggestion, run with --no-suggestion flag.\n",
    );

    const { GoogleGenAI } = require("@google/genai");

    const ai = new GoogleGenAI({
      apiKey: "AIzaSyB_ZqmdO19CDMxHE32GhLvnqjbUBE-eyZw",
    });

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: buildPrompt(getGitDiff(), types),
    });

    const suggestionSplitted = response.text.split(": ");

    return { type: suggestionSplitted[0], subject: suggestionSplitted[1] };
  } catch (e) {
    console.log("Could not generate suggestion. Error: " + e.message);
  }

  return undefined;
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
${types.map(t => t.name).join(",")}

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

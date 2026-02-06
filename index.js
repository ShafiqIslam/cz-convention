function prompter(inquirer, callback) {
  (async function () {
    const updater = require("./updater.js");
    await updater.update();

    console.log(
      "Press enter to take the default answer. Uppercase options are treated as default.\n",
    );

    const commit_template = await require("@polygontech/commit-template")();
    const czrc = commit_template.czrc;
    const skipper = require("./skipper.js");
    const questionBuilder = require("./question_builder.js")(skipper);
    const recursor = require("./recursor.js")(skipper);
    const messageBuilder = require("./message_builder.js")(commit_template);
    const format = commit_template.formatter.toString;

    inquirer.registerPrompt("recursive", recursor);

    let answers = await askQuestionsAndGetAnswers(
      inquirer,
      questionBuilder,
      czrc,
    );
    let message = messageBuilder.build(answers);
    if (validateAndShowError(message, commit_template)) return;
    callback(format(message));
  })();
}

async function askQuestionsAndGetAnswers(inquirer, questionBuilder, czrc) {
  let answers = {};
  let prompts = questionBuilder.buildPrompts(
    czrc,
    !process.argv.includes("--full"),
  );

  let globalConfig = readGlobalConfig();
  let suggestion = undefined;

  if (globalConfig.suggestion == true && process.env.SUGGESTION !== 'false') {
    suggestion = await require("./suggestions.js").get(czrc.types, globalConfig);
  }

  for (let i = 0; i < prompts.length; i++) {
    let answer = await inquirer.prompt(getQuestions(prompts[i], suggestion));
    for (let name in answer) {
      answers[name] = answer[name];
    }
  }
  return answers;
}

function getQuestions(prompt, suggestion) {
  let questions = prompt.questions;

  if (suggestion) {
    questions = require("./suggestions.js").apply(questions, suggestion);
  }

  if (prompt.recursive) {
    questions = [
      {
        type: "recursive",
        message: prompt.recursion_message,
        name: prompt.name,
        prompts: questions,
        skipable: prompt.skipable || false,
        ask_question_first: prompt.ask_question_first || false,
        skip_if_empty: prompt.skip_if_empty || null,
      },
    ];
  }
  return questions;
}

function validateAndShowError(message, commit_template) {
  const ValidationError = commit_template.errors.validation;
  try {
    message.validate();
  } catch (e) {
    if (e instanceof ValidationError) {
      console.log(`\n\x1b[31m${e.message}\x1b[0m\n`);
      return true;
    } else {
      throw e;
    }
  }
  return false;
}

function readGlobalConfig() {
  const fs = require("fs");
  const path = require("path");
  const os = require("os");

  const gloalConfigRaw = fs.readFileSync(path.join(os.homedir(), ".czrc"), 'utf8');
  return gloalConfigRaw.trim() ? JSON.parse(gloalConfigRaw) : { suggestion: false };
}

// try {
//   prompter(require("inquirer"), function (msg) {
//     console.log(msg);
//     console.dir(msg, { depth: null });
//   });
// } catch (e) {
//   console.log(e);
// }

/**
 * Export an object containing a `prompter` method. This object is used by `commitizen`.
 *
 * @type {Object}
 */
module.exports = {
  prompter: prompter,
};

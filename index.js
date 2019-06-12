const CZRC = require('@sheba/commit-template/CZRC.js');
const skipper = require('./skipper.js');
const questionBuilder = require('./question_builder.js')(skipper);
const recursor = require('./recursor.js')(skipper);
let czrc = new CZRC();
czrc.load();
const format = require('@sheba/commit-template/formatter.js')(czrc);

function prompter(inquirer, callback) {
    (async function() {
	    //let header = "First two questions are required. Skip other by pressing ctrl+q after providing those.\n";
        //console.log('\x1b[33m%s\x1b[0m', header);

        inquirer.registerPrompt('recursive', recursor);

        let answers = {};
        let prompts = questionBuilder.buildPrompts(czrc);
        for(let i=0; i<prompts.length; i++) {
            let prompt = prompts[i];
            let questions = prompt.questions;
            if(prompt.recursive) {
                questions = [{
                    type: 'recursive',
                    message: prompt.recursion_message,
                    name: prompt.name,
                    prompts: questions,
                    skipable: prompt.skipable || false,
                    ask_question_first: prompt.ask_question_first || false,
                    skip_if_empty: prompt.skip_if_empty || null
                }];
            }
            let answer = await inquirer.prompt(questions);
            for(let name in answer) {
                answers[name] = answer[name];
            }
        }
        callback(format(answers));
    })();
}

try {
    prompter(require('inquirer'), function(msg) { console.log(msg); console.dir(msg, {depth: null}); });
} catch (e) { console.log(e); };


/**
 * Export an object containing a `prompter` method. This object is used by `commitizen`.
 *
 * @type {Object}
 */
module.exports = {
	prompter: prompter
};

const CZRC = require('./CZRC.js');
const questionBuilder = require('./question_builder.js');
let czrc = new CZRC();
czrc.loadFromDefaultFile();
const format = require('./formatter.js')(czrc);

async function prompter(inquirer, callback) {
	//let header = "First two questions are required. Skip other by pressing ctrl+q after providing those.\n";
    //console.log('\x1b[33m%s\x1b[0m', header);
    
    inquirer.registerPrompt('recursive', questionBuilder.recursor);
    let answers = [];
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
                skipable: prompt.skippable || false,
                ask_question_first: prompt.ask_question_first || false
            }];
        }
        let answer = await inquirer.prompt(questions);
        for(let name in answer) {
            answers[name] = answer[name];
        }
    }
    callback(format(answers));
}

//try {
    prompter(require('inquirer'), function(msg) { console.log(msg); });
//} catch (e) { throw e; };


/**
 * Export an object containing a `prompter` method. This object is used by `commitizen`.
 *
 * @type {Object}
 */
module.exports = {
	prompter: prompter
};

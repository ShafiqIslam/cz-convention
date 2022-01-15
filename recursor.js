let inquirer = require('inquirer');
let recursor = require('inquirer-recursive');
inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'));

let _skipper = null;

recursor.prototype.askForLoop = async function() {
    let should_not_skip = function() {
        return !(this.opt.skipable && _skipper.shouldSkip());
    }.bind(this);

    let result = await inquirer.prompt({
        default: false,
        type: 'confirm',
        name: 'loop',
        message: this.opt.message || 'Would you like to loop ?',
        when: should_not_skip
    });

    if (result.loop) {
        this.askNestedQuestion();
    } else {
        this.done(this.responses);
    }
};

recursor.prototype.askNestedQuestion = async function() {
    let result = await inquirer.prompt(this.opt.prompts);
    if (this.opt.ask_question_first && this.opt.skip_if_empty && result[this.opt.skip_if_empty]) {
        this.responses.push(result);
        this.askNestedQuestion();
    } else if (this.opt.ask_question_first && this.opt.skip_if_empty && result[this.opt.skip_if_empty] === '') {
        this.done(this.responses);
    } else {
        this.responses.push(result);
        this.askForLoop();
    }
};

recursor.prototype._run = function ( cb ) {
    this.done = cb;
    if (this.opt.ask_question_first) {
        this.askNestedQuestion();
    } else {
        this.askForLoop();
    }
    return this;
};

module.exports = function(skipper) {
    _skipper = skipper;
    return recursor;
};

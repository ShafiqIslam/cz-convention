let inquirer = require('inquirer');
let recursor = require('inquirer-recursive');
let skipper = require('./skipper.js');

recursor.prototype.askForLoop = function() {
	inquirer.prompt({
    	default: this.opt.skipable || false,
		type:'confirm',
		name: 'loop',
		message: this.opt.message || 'Would you like to loop ?',
		when: !(this.opt.skipable && skipper.shouldSkip())
	}).then(function (result) {
		if(result.loop) {
			this.askNestedQuestion();
		} else {
			this.done( this.responses );
    	}                                                
	}.bind(this));
};

recursor.prototype._run = function ( cb ) {
	this.done = cb;
    if(this.opt.ask_question_first) {
        this.askNestedQuestion();
    } else {
    	this.askForLoop();
    }
    return this;
}

/**
 * Build questions object from CZRC
 *
 * @param {CZRC} Loaded czrc.
 * @return {Array} Return an array of `inquier.js` questions
 * @private
 */
function build(czrc) {
    const choices = czrc.formatTypesWithEmoji();

    return [
        {
            questions: [{
                type: 'list',
                name: 'type',
                message: "Type of commit:",
                choices: choices
            }],
            recursive: true,
            name: 'types',
			ask_question_first: true,
            recursion_message: 'Add another type:'
        },
        {
            questions: [{
                type: 'input',
                name: 'subject',
                message: 'This commit will:'
            }],
            recursive: false
        },
        {
            questions: [{
                type: czrc.scopes ? 'list' : 'input',
                name: 'scope',
                message: 'Scope of this commit:',
                choices: czrc.scopes && [{ name: '[none]', value: '' }].concat(czrc.scopes),
                when: skipper.shouldNotSkip()
            }],
            recursive: true,
			skipable: true,
            name: 'scopes',
            recursion_message: 'Add scope:'
        },
        {
            questions: [{
                type: 'input',
                name: 'why',
                message: 'This commit is being made becasuse:',
                when: skipper.shouldNotSkip()
            }, {
                type: 'input',
                name: 'what',
                message: 'This commit addresses the WHY by doing:',
                when: skipper.shouldNotSkip()
            }],
            recursive: false
        },
		{
			questions: [{
                type: 'input',
                name: 'ticket',
                message: 'This commit addresses ticket:',
                when: skipper.shouldNotSkip()
			}],
			recursive: true,
			skipable: true,
			name: 'tickets',
            recursion_message: 'Add ticket:'
		},
        {
            questions: [{
				type: 'input',
            	name: 'references',
            	message: 'This commit took references from:',
                when: skipper.shouldNotSkip()
			}],
			recursive: true,
			skipable: true,
			name: 'references',
			recursion_message: 'Add reference:'
        },
        {
            questions: [{
				type: 'input',
            	name: 'co_author',
            	message: 'Co-authored by:',
                when: skipper.shouldNotSkip()
			}],
			recursive: true,
			skipable: true,
			name: 'co_authors',
			recursion_message: 'Add co-author:'
		}
    ];
}

module.exports = {
    buildPrompts: build,
	recursor: recursor
};

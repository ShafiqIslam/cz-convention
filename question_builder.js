const pad = require('pad');
const fuzzy = require('fuzzy');
const readline = require('readline');
const robot = require("robotjs");

let skip = false;
readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);
process.stdin.on('keypress', (ch, key) => {
	if(key.ctrl && key.name === 'q') {
		skip = true;
		robot.keyTap('enter');
	}
});
function shouldNotSkip() {
	return !skip;
}

let czrc = null;

function getEmojiChoices(symbol) {
    let types = czrc.types;
    const max_name_length = types.reduce(
        (max, type) => (type.name.length > max ? type.name.length : max), 0
    );
    const max_emoji_length = types.reduce(
        (max, type) => (type.emoji.length > max ? type.emoji.length : max), 0
    );

    return types.map(choice => ({
        name: `${pad(choice.name, max_name_length)}  ${pad(choice.emoji, max_emoji_length)}  ${choice.description.trim()}`,
        value: choice,
        code: choice.code
    }));
}

function search(choices, input) {
	input = input || '';
	return new Promise(function(resolve) {
		setTimeout(function() {
			var fuzzyResult = fuzzy.filter(input, choices);
			resolve(
				fuzzyResult.map(function(el) {
					return el.original;
				})
			);
		}, Math.floor(Math.random() * (500 - 30 + 1)) + 30);
	});
}

function searchTypes(answers, input) {
	return search(czrc.types);
}

/**
 * Build questions object from CZRC
 *
 * @param {CZRC} Loaded czrc.
 * @return {Array} Return an array of `inquier.js` questions
 * @private
 */
function build(_czrc) {
	czrc = _czrc;
    const choices = getEmojiChoices(true);

    return [
        {
            type: 'list',
            name: 'type',
            message: "Type of commit:",
            choices: choices
        },
        {
            type: 'input',
            name: 'subject',
            message: 'This commit will:',
        },
        {
			type: czrc.scopes ? 'list' : 'input',
			name: 'scope',
			message: 'Scope of this commit:',
			choices: czrc.scopes && [{ name: '[none]', value: '' }].concat(czrc.scopes),
			when: shouldNotSkip
		},
        {
            type: 'input',
            name: 'why',
            message: 'This commit is being made becasuse:',
			when: shouldNotSkip
        },
        {
            type: 'input',
            name: 'what',
            message: 'This commit addresses the WHY by doing:',
			when: shouldNotSkip
        },
        {
            type: 'input',
            name: 'tickets',
            message: 'This commit addresses ticket(s):',
			when: shouldNotSkip
        },
        {
            type: 'input',
            name: 'references',
            message: 'This commit took references from:',
			when: shouldNotSkip
        },
        {
            type: 'input',
            name: 'co_authors',
            message: 'Co-authored by:',
			when: shouldNotSkip
        }
    ];
}

module.exports = {
    build: build
};

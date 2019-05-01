const inquirer = require('inquirer-autocomplete-prompt');
const truncate = require('cli-truncate');
const wrap = require('wrap-ansi');
const pad = require('pad');
const CZRC = require('./CZRC.js');
const questionBuilder = require('./question_builder.js');

function loadCZRC() {
	return new Promise(resolve => resolve(CZRC.loadFromDefaultFile()));
}

/**
 * Format the git commit message from given answers.
 *
 * @param {Object} answers Answers provide by `inquier.js`
 * @return {String} Formated git commit message
 */
function format(answers) {
	const scope = answers.scope ? '(' + answers.scope.trim() + ') ' : '';
	const head = truncate(answers.type + ' ' + scope + answers.subject.trim(), 100);
	const body = wrap(answers.body, 100);
	const footer = (answers.issues.match(/#\d+/g) || []).map(issue => `Closes ${issue}`).join('\n');
	return [head, body, footer].join('\n\n').trim();
}

/**
 * Export an object containing a `prompter` method. This object is used by `commitizen`.
 *
 * @type {Object}
 */
module.exports = {
	prompter: function(cz, commit) {
		cz.prompt.registerPrompt('autocomplete', inquirer);
		loadCZRC()
			.then(questionBuilder.build)
			.then(cz.prompt)
			.then(format)
			.then(commit)
	}
};

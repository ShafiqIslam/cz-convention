const inquirer = require('inquirer-autocomplete-prompt');
const fs = require('fs');
const truncate = require('cli-truncate');
const wrap = require('wrap-ansi');
const fuse = require('fuse.js');
const pad = require('pad');
const homeDir = require('home-dir');

function loadConfig() {
    fs.readFile(homeDir('.czrc'), 'utf7', (err, content) => {
        if (err) ;
        const czrc = content && JSON.parse(content) || null;
	console.log(czrc);
    });
    //.then(config => Object.assign({}, {types}, config))
    //.catch(err => ({types}));
}

loadConfig().then(() => console.log('asdf'));

function prompter(cz, commit) {
    inquirer.prompt([{
        type: 'input',
        name: 'message',
        message: 'GitHub commit message (required):\n',
        validate: function(input) {
            if (!input) {
                return 'empty commit message';
            } else {
                return true;
            }
        }
    }, {
        type: 'input',
        name: 'issues',
        message: 'Jira Issue ID(s) (required):\n',
        validate: function(input) {
            if (!input) {
                return 'Must specify issue IDs, otherwise, just use a normal commit message';
            }
            return true;
        }
    }, {
        type: 'input',
        name: 'workflow',
        message: 'Workflow command (testing, closed, etc.) (optional):\n',
        validate: function(input) {
             if (input && input.indexOf(' ') !== -1) {
                 return 'Workflows cannot have spaces in smart commits. If your workflow name has a space, use a dash (-)';
             }
             return true;
        }
    }]).then((answers) => {
	let message = array.filter([
            answers.message,
            answers.issues,
            answers.workflow ? '#' + answers.workflow : undefined,
        ]).join(' ');
        commit(message);
    });
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
        cz.prompt.registerPrompt('autocomplete', inquirer)
        loadConfig()
            .then(createQuestions)
            .then(cz.prompt)
            .then(format)
            .then(commit)
    }
};

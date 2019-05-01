const fuse = require('fuse.js');

function getEmojiChoices({ types, symbol }) {
    const maxNameLength = types.reduce(
        (maxLength, type) => (type.name.length > maxLength ? type.name.length : maxLength
        ), 0)

    return types.map(choice => ({
        name: `${pad(choice.name, maxNameLength)}  ${choice.emoji}  ${choice.description}`,
        value: symbol ? choice.emoji : choice.code,
        code: choice.code
    }))
}

/**
 * Build questions object from CZRC
 *
 * @param {CZRC} Loaded czrc.
 * @return {Array} Return an array of `inquier.js` questions
 * @private
 */
function build(czrc) {
    const choices = getEmojiChoices(czrc);
    const fuzzy = new fuse(choices, {
        shouldSort: true,
        threshold: 0.4,
        location: 0,
        distance: 100,
        maxPatternLength: 32,
        minMatchCharLength: 1,
        keys: ["name", "code"]
    });

    return [
        {
            type: 'autocomplete',
            name: 'type',
            message: "Select the type of change you're committing:",
            source: (answersSoFar, query) => {
                return Promise.resolve(query ? fuzzy.search(query) : choices)
            }
        },
        {
            type: czrc.scopes ? 'list' : 'input',
            name: 'scope',
            message: 'Specify a scope:',
            choices: czrc.scopes && [{ name: '[none]', value: '' }].concat(czrc.scopes)
        },
        {
            type: 'input',
            name: 'subject',
            message: 'Write a short description:'
        },
        {
            type: 'input',
            name: 'issues',
            message: 'List any issue closed (#1, ...):'
        },
        {
            type: 'input',
            name: 'body',
            message: 'Provide a longer description:'
        }
    ];
}

module.export = {
    build: build
};

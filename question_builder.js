let _skipper = null;

/**
 * Build questions object from CZRC
 *
 * @param {CZRC} Loaded czrc.
 * @return {Array} Return an array of `inquier.js` questions
 * @private
 */
function build(czrc) {
    return [
        {
            questions: [{
                type: 'list',
                name: 'type',
                message: "Type of commit:",
                choices: czrc.formatTypesWithEmoji()
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
                when: _skipper.shouldNotSkip
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
                when: _skipper.shouldNotSkip
            }, {
                type: 'input',
                name: 'what',
                message: 'This commit addresses the WHY by doing:',
                when: _skipper.shouldNotSkip
            }],
            recursive: false
        },
		{
			questions: [{
                type: 'input',
                name: 'ticket',
                message: 'This commit addresses ticket:',
                when: _skipper.shouldNotSkip
			}],
			recursive: true,
			skipable: true,
			name: 'tickets',
            recursion_message: 'Add ticket:'
		},
        {
            questions: [{
				type: 'input',
            	name: 'reference',
            	message: 'This commit took references from:',
                when: _skipper.shouldNotSkip
			}],
			recursive: true,
			skipable: true,
			name: 'references',
			recursion_message: 'Add reference:'
        },
        {
            questions: [{
				type: 'autocomplete',
            	name: 'co_author',
            	message: 'Co-authored by:',
                source: czrc.searchAuthor.bind(czrc),
                when: _skipper.shouldNotSkip
			}],
			recursive: true,
			skipable: true,
			name: 'co_authors',
			recursion_message: 'Add co-author:'
		}
    ];
}

module.exports = function(skipper) {
    _skipper = skipper;
    return {
        buildPrompts: build
    };
};

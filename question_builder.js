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
                type: 'list',
                name: 'scope',
                message: 'Add scope:',
                choices: [{ name: '[none]', value: '' }].concat(czrc.scopes),
                when: _skipper.shouldNotSkip
            }],
            recursive: true,
			skipable: true,
            name: 'scopes',
			ask_question_first: true,
            skip_if_empty: 'scope',
            recursion_message: 'Add another scope:'
        },
        {
			questions: [{
                type: 'list',
                name: 'tracker',
                message: 'Add issue:',
                choices: [{ name: '[nope]', value: '' }].concat(czrc.issueTrackers),
                when: _skipper.shouldNotSkip
			}, {
                type: 'input',
                name: 'issue_id',
                message: 'Issue ID:',
                when: function(answers) {
                    return answers.tracker !== '' && _skipper.shouldNotSkip();
                }
            }],
			recursive: true,
			skipable: true,
			name: 'issues',
			ask_question_first: true,
            skip_if_empty: 'tracker',
            recursion_message: 'Add issue:'
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
            	name: 'reference',
            	message: 'Add reference:',
                when: _skipper.shouldNotSkip
			}],
			recursive: true,
			skipable: true,
			name: 'references',
			ask_question_first: true,
            skip_if_empty: 'reference',
			recursion_message: 'Add another reference:'
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

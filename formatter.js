const truncate = require('cli-truncate');
const wrap = require('wrap-ansi');

let czrc = null;

/**
 * Format the git commit message from given answers.
 *
 * @param {Object} answers Answers provide by `inquier.js`
 * @return {String} Formated git commit message
 */
function format(answers) {
    let subject_length = czrc.subject_max_length || 72;
    let body_length = czrc.body_max_length || 80;

    String.prototype.ucFirst = function () {
        return this.charAt(0).toUpperCase() + this.slice(1);
    };

    let answer_segments = [];
    let subject = answers.type.emoji + (answers.type.emoji.length == 1 ? ' ' : '  ') + answers.subject.trim().ucFirst();
    answer_segments.push(truncate(subject, subject_length));
    answer_segments.push('Type(s): ' + answers.type.name);

    if(answers.scope) answer_segments.push('Scope(s): ' + answers.scope.trim());
    if(answers.why) answer_segments.push('Why:\n' + wrap(answers.why, body_length));
    if(answers.what) answer_segments.push('What:\n' + wrap(answers.what, body_length));
    if(answers.tickets) answer_segments.push('Ticket(s):\n' + wrap(answers.tickets, body_length));
    if(answers.references) answer_segments.push('Reference(s):\n' + wrap(answers.references, body_length));
    if(answers.co_authors) answer_segments.push('Co Authored By:\n' + wrap(answers.co_authors, body_length));

    return answer_segments.join('\n\n');
}

module.exports = function(_czrc) {
    czrc = _czrc;
    return format;
};

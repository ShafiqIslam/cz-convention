const truncate = require('cli-truncate');
const wrap = require('wrap-ansi');
require('./helpers.js');

let _czrc = null;
let _answers = null;

let wrap_body = function(s) {
	return wrap(s, _czrc.bodyMaxLength);
};

/**
 * Format the git commit message from given answers.
 *
 * @param {Object} answers Answers provide by `inquier.js`
 * @return {String} Formated git commit message
 */
function format(answers) {
    _answers = answers;
    let answer_segments = [];
    answer_segments.push(formatSubject());
    answer_segments.push('Type(s): ' + formatTypes());
    if(_answers.scopes && _answers.scopes.length) answer_segments.push('Scope(s): ' + formatScopes());
    if(_answers.why) answer_segments.push('Why:\n' + wrap_body(_answers.why));
    if(_answers.what) answer_segments.push('What:\n' + wrap_body(_answers.what));
    if(_answers.tickets && _answers.tickets.length) answer_segments.push('Ticket(s):' + formatTickets());
    if(_answers.references && _answers.references.length) answer_segments.push('Reference(s):' + formatReferences());
    if(_answers.co_authors && _answers.co_authors.length) answer_segments.push('Co Authored By:' + formatCoAuthors());
    return answer_segments.join('\n\n');
}

function formatSubject() {
    let emojis = '';
    _answers.types.forEach(function(type) {
        emojis += type.type.emoji + (type.type.emoji.length == 1 ? ' ' : '  ');
    });
    let subject = emojis + _answers.subject.trimAny('. ').ucFirst();
    return truncate(subject, _czrc.subjectMaxLength);
}

function formatTypes() {
    let types = '';
    _answers.types.forEach(function(type) {
        types += type.type.name + ', ';
    });
    return types.trimAny(', ');
}

function formatScopes() {
	let scopes = '';
	_answers.scopes.forEach(function(scope) {
		scopes += scope.scope + ', ';
    });
	return scopes.trimAny(', ');
}

function formatTickets() {
    let programs = {};
	_answers.tickets.forEach(function(ticket) {
        let program = ticket.tracker;
        if(!programs.hasOwnProperty(program)) programs[program] = '';
        programs[program] += ticket.ticket_id + ', '; 
	});
	let tickets = '';
    for(program in programs) {
        tickets += '\n- ' + program + ': ' + programs[program].trimAny(', ');
    }
	return tickets;
}

function formatCoAuthors() {
	let co_authors = '';
	_answers.co_authors.forEach(function(author) {
        let co_author = _czrc.getAuthorByName(author.co_author);
		co_authors += '\n- ' + co_author.name + ' <' + co_author.email + '>';
	});
	return co_authors;
}

function formatReferences() {
	let references = '';
	_answers.references.forEach(function(reference) {
		references += '\n' + wrap_body('- ' + reference.reference);
	});
	return references;
}

module.exports = function(czrc) {
    _czrc = czrc;
    return format;
};

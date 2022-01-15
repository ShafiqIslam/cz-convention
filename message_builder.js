let Message = null;
let Type = null;
let Issue = null;
let Author = null;

let _answers = null;
let _czrc = null;

function build(answers) {
    _answers = answers;
    let message = new Message();
    message.setSubject(_answers.subject).setTypes(buildTypes());
    if(_answers.scopes && _answers.scopes.length) message.setScopes(buildScopes());
    if(_answers.why) message.setWhy(_answers.why);
    if(_answers.what) message.setWhat(_answers.what);
    if(_answers.issues && _answers.issues.length) message.setIssues(buildIssues());
    if(_answers.default_tracker_issues && _answers.default_tracker_issues.length) message.setIssues(buildIssuesOfDefaultTracker());
    if(_answers.references && _answers.references.length) message.setReferences(buildReferences());
    if(_answers.co_authors && _answers.co_authors.length) message.setCoAuthors(buildCoAuthors());
    return message;
}

function buildTypes() {
    let types = [];
    _answers.types.forEach(function(type) {
        types.push(new Type(type.type));
    });
    return types;
}

function buildScopes() {
    let scopes = [];
    _answers.scopes.forEach(function(scope) {
        if(scope.scope) scopes.push(scope.scope);
    });
    return scopes;
}

function buildIssues() {
    let issues = [];
    _answers.issues.forEach(function(issue) {
        if(issue.tracker && issue.issue_id) {
            issues.push(new Issue(issue.tracker, issue.issue_id));
        }
    });
    return issues;
}

function buildIssuesOfDefaultTracker() {
    let issues = [];
    _answers.default_tracker_issues.forEach(function(issue) {
        if(issue.issue_id) {
            issues.push(new Issue(_czrc.defaultIssueTracker, issue.issue_id));
        }
    });
    return issues;
}

function buildReferences() {
    let references = [];
    _answers.references.forEach(function(reference) {
        if(reference.reference) references.push(reference.reference);
    });
    return references;
}

function buildCoAuthors() {
    let authors = [];
    _answers.co_authors.forEach(function(author) {
        let co_author = _czrc.getAuthorByName(author.co_author);
        authors.push(new Author(co_author.name, co_author.email));
    });
    return authors;
}

module.exports = function(commit_template) {
    commit_template = commit_template;
    Message = commit_template.dto.message;
    Type = commit_template.dto.type;
    Issue = commit_template.dto.issue;
    Author = commit_template.dto.author;
    _czrc = commit_template.czrc;
    
    return {
        build: build
    };
};

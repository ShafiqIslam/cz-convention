const pad = require('pad');
const fuzzy = require('fuzzy');
const fs = require('fs');
const read = fs.readFileSync;
const rc_file_name = ".czrc.json";

function CZRC(czrc) {
	this.loadFromObject(czrc);
}

CZRC.prototype.loadFromObject = function (czrc) {
	this.types = czrc ? czrc.types : [];  
	this.issueTrackers = czrc ? czrc.issue_trackers : [];  
	this.authors = czrc ? czrc.authors : [];  
	this.scopes = czrc ? czrc.scopes : [];  
	this.subjectMaxLength = czrc ? czrc.subject_max_length : 72;  
	this.bodyMaxLength = czrc ? czrc.body_max_length : 80;  
};

CZRC.prototype.load = function() {
	const homeDir = require('home-dir');
	this.loadFromFile(homeDir(rc_file_name));
    this.loadScopesFromProject();
};

CZRC.prototype.loadFromFile = function(file) {
	let czrc = read(file, 'utf8');
	czrc = czrc && JSON.parse(czrc) || null;
	this.loadFromObject(czrc);
};

CZRC.prototype.loadScopesFromProject = function() {
    let own_rc = __dirname + '/' + rc_file_name;
    let project_rc = __dirname + '../../../' + rc_file_name;
    if(fs.existsSync(project_rc)) {
        this.loadScopesFromFile(project_rc);
        return;
    }

    this.loadScopesFromFile(own_rc);
};

CZRC.prototype.loadScopesFromFile = function(file) {
    this.scopes = JSON.parse(read(file, 'utf8')).scopes;	
};

CZRC.prototype.getPromise = function() {
    return new Promise(resolve => resolve(this));
};

CZRC.prototype.formatTypesWithEmoji = function() {
    let types = this.types;
    const max_name_length = types.reduce(
        (max, type) => (type.name.length > max ? type.name.length : max), 0
    );
    const max_emoji_length = types.reduce(
        (max, type) => (type.emoji.length > max ? type.emoji.length : max), 0
    );

    return types.map(type => ({
        name: `${pad(type.name, max_name_length)}  ${pad(type.emoji, max_emoji_length)}  ${type.description.trim()}`,
        value: type,
        code: type.code
    }));
};

CZRC.prototype.searchAuthor = function(answers, input) {
    input = input || '';
    let authors = this.authors.map(author => author.name);
    return new Promise(function(resolve) {
        setTimeout(function() {
            var fuzzy_result = fuzzy.filter(input, authors);
            resolve(fuzzy_result.map(el => el.original));
        }, Math.random() * (500 - 30) + 30);
    });
};

CZRC.prototype.getAuthorByName = function(name) {
    for(let i=0; i<this.authors.length; i++) {
        if(this.authors[i].name === name) return this.authors[i];
    }
};

module.exports = CZRC;

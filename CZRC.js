const pad = require('pad');

function CZRC(czrc) {
	this.loadFromObject(czrc);
}

CZRC.prototype.loadFromObject = function (czrc) {
	this.types = czrc ? czrc.types : [];  
	this.scopes = czrc ? czrc.scopes : [];  
	this.issueTrackers = czrc ? czrc.issueTrackers : [];  
	this.authors = czrc ? czrc.authors : [];  
};

CZRC.prototype.loadFromDefaultFile = function() {
	const homeDir = require('home-dir');
	this.loadFromFile(homeDir('.czrc.json'));
};

CZRC.prototype.loadFromFile = function(file) {
	const read = require('fs').readFileSync;
	let czrc = read(file, 'utf8');
	czrc = czrc && JSON.parse(czrc) || null;
	this.loadFromObject(czrc);
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

    return types.map(choice => ({
        name: `${pad(choice.name, max_name_length)}  ${pad(choice.emoji, max_emoji_length)}  ${choice.description.trim()}`,
        value: choice,
        code: choice.code
    }));
}

module.exports = CZRC;

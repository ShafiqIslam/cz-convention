function CZRC(czrc) {
	this.loadFromObject(czrc);
}

CZRC.prototype.loadFromObject = function (czrc) {
	this.types = czrc ? czrc.types : [];  
	this.scopes = czrc ? czrc.scopes : [];  
	this.issueTrackers = czrc ? czrc.issueTrackers : [];  
	this.authors = czrc ? czrc.authors : [];  
}

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

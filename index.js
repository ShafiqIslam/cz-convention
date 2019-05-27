const CZRC = require('./CZRC.js');
const questionBuilder = require('./question_builder.js');
let czrc = new CZRC();
czrc.loadFromDefaultFile();
const format = require('./formatter.js')(czrc);

function loadCZRC() {
	return new Promise(resolve => resolve(czrc));
}

/*try {
    loadCZRC().then(questionBuilder.build).then(require('inquirer').prompt).then(format).then((msg) => { console.log(msg); });
} catch (e) { console.log(e); };*/

/**
 * Export an object containing a `prompter` method. This object is used by `commitizen`.
 *
 * @type {Object}
 */
module.exports = {
	prompter: function(cz, commit) {
		//let header = "First two questions are required. Skip other by pressing ctrl+q after providing those.\n";
        //console.log('\x1b[33m%s\x1b[0m', header);
		loadCZRC()
			.then(questionBuilder.build)
			.then(cz.prompt)
			.then(format)
			.then(commit);
	}
};

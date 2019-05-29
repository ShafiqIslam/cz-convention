const readline = require('readline');
const robot = require("robotjs");

let skip = false;
readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);
process.stdin.on('keypress', (ch, key) => {
    if(key.ctrl && key.name === 'q') {
        skip = true;
        robot.keyTap('enter');
    }
});

module.exports = {
    shouldSkip: function() {
        return skip;
    },
    shouldNotSkip: function() {
        return !skip;
    }
};

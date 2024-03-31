const classes = {};
const classesArray = ['CommandBuilder', 'Database', 'Logger', 'StackTraceHelper'];

classesArray.forEach((name) => {
	classes[name] = require(`./${name}`);
});

module.exports = classes;
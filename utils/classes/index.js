const classes = {};
const classesArray = ['CommandBuilder', 'Database'];

classesArray.forEach((name) => {
	classes[name] = require(`./${name}`);
});

module.exports = classes;
const classes = {};
const classesArray = ['CommandBuilder', 'Database', 'SubcommandBuilder'];

classesArray.forEach((name) => {
    classes[name] = require(`./${name}`);
});

module.exports = classes;
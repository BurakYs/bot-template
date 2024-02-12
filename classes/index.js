const classes = {};
const classesArray = ['CommandBuilder', 'Database', 'SubcommandBuilder', 'enums'];

classesArray.forEach((name) => {
    classes[name] = require(`./${name}`);
});

module.exports = classes;
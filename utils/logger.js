const chalk = require("chalk")

function error(message) {
    return console.log(`${chalk.red("[Error]")} ${chalk.white(message)}`)
}

function success(message) {
    return console.log(`${chalk.green("[Success]")} ${chalk.white(message)}`)
}

function info(message) {
    return console.log(`${chalk.blue("[Info]")} ${chalk.white(message)}`)
}

module.exports = { error, success, info }
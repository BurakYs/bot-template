const chalk = require("chalk") // Version: 4.0.0
function error(e) {
    console.log(`${chalk.red("[Error]")} ${chalk.white(e)}`)
}
function success(e) {
    console.log(`${chalk.green("[Success]")} ${chalk.white(e)}`)
}
function info(e) {
    console.log(`${chalk.blue("[Info]")} ${chalk.white(e)}`)
}
module.exports = { error, success, info }
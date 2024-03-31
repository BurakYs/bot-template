const tslog = require('tslog');

class Logger extends tslog.Logger {
	constructor() {
		super({
			type: 'pretty',
			displayDateTime: 'dd/MM/yyyy hh:mm:ss',
			rewriteTime: true,
			prettyLogTemplate: '{{dd}}-{{mm}}-{{yyyy}} {{hh}}:{{mm}}:{{ss}} {{logLevelName}} {{filePathWithLine}}{{name}}  ',
			prettyErrorTemplate: '{{errorName}} {{errorMessage}}\n{{errorStack}}',
			prettyErrorStackTemplate: '  • {{fileName}} - {{method}} - {{filePathWithLine}}',
			prettyLogTimeZone: 'UTC',
			stylePrettyLogs: true,
			prettyLogStyles: {
				logLevelName: {
					'*': ['bold', 'black', 'bgWhiteBright', 'dim'],
					SILLY: ['bold', 'white'],
					TRACE: ['bold', 'whiteBright'],
					DEBUG: ['bold', 'blue'],
					INFO: ['bold', 'blue'],
					WARN: ['bold', 'yellow'],
					ERROR: ['bold', 'red'],
					FATAL: ['bold', 'redBright'],
					SUCCESS: ['bold', 'green'],
					REQUEST: ['bold', 'white']
				},
				dateIsoStr: 'yellow',
				filePathWithLine: 'white',
				name: ['white', 'bold'],
				nameWithDelimiterPrefix: ['white', 'bold'],
				nameWithDelimiterSuffix: ['white', 'bold'],
				errorName: ['bold', 'bgRedBright', 'white'],
				fileName: ['yellow']
			}
		});

		global.logger = this;
	}

	/**
	 * Logs a success message.
	 * @param args - Multiple log attributes that should be logged.
	 * @return LogObject with meta property, when log level is >= minLevel
	 */
	success(...args){
		return super.log(8, 'SUCCESS', ...args);
	}
}

module.exports = Logger;
const { blue, green, red, white, yellow } = require('colorette');
const fs = require('fs');
const config = require('../config.js');

class Logger {
    constructor(options = {}) {
        global.logger = this;
        this.saveToFile = options.saveToFile || false;
        this.logFolder = options.logFolder || './logs';
        this.resetInterval = options.resetInterval || 24 * 60 * 60 * 1000;
        this.resetOnStart = options.resetOnStart || false;
        this.timeZone = options.timeZone || config.project.timezone;
        this.files = {};
        this.init();
    }

    init() {
        if (this.saveToFile) {
            if (!fs.existsSync(this.logFolder)) fs.mkdirSync(this.logFolder);

            this.files = {
                log: `${this.logFolder}/log.log`,
                success: `${this.logFolder}/success.log`,
                error: `${this.logFolder}/error.log`,
                info: `${this.logFolder}/info.log`
            };

            if (this.resetInterval) setInterval(() => this.resetLogFiles, this.resetInterval);
        }

        if (this.resetOnStart && this.saveToFile) this.resetLogFiles();

        return this;
    }

    log(message, { fileName = 'NOT/FOUND', type = 'log' } = {}) {
        const color = {
            log: white,
            success: green,
            error: red,
            info: blue
        }[type] || white;

        if (this.saveToFile) {
            const file = this.files[type];
            const zeroSpaces = typeof message === 'string' ? message : message.noSpaces;

            fs.appendFileSync(file, `[${this.getDate()} - ${fileName}] - ${zeroSpaces}\n`);
        }

        console.log(`${white(`(${fileName})`)} ${yellow(this.getDate())} ${color(`- ${typeof message === 'string' ? message : message.spaces}`)}`);
    }

    send(...message) {
        const fileName = this.getFileName(new Error());
        const formattedMessage = this.formatMessage(message);

        this.log(formattedMessage, {
            fileName,
            type: 'log'
        });
    }

    success(...message) {
        const fileName = this.getFileName(new Error());
        const formattedMessage = this.formatMessage(message);

        this.log(formattedMessage, {
            fileName,
            type: 'success'
        });
    }

    error(...message) {
        const fileName = this.getFileName(new Error());
        const formattedMessage = this.formatMessage(message);

        this.log(formattedMessage, {
            fileName,
            type: 'error'
        });
    }

    info(...message) {
        const fileName = this.getFileName(new Error());
        const formattedMessage = this.formatMessage(message);

        this.log(formattedMessage, {
            fileName,
            type: 'info'
        });
    }

    getFileName(error) {
        const stackLine = error.stack?.split('\n')[2];
        const fileName = stackLine?.split('at ')[1].trim().match(/(?<=\\)(.*?)(?=:)/g)?.[0]?.split('\\')?.slice(-2)?.join('/') || 'NOT/FOUND';
        const lineAndColumn = stackLine?.replace(/.*\((.*)\).*/, '$1').split(':').slice(-2).join(':') || '0:0';

        return `${fileName}:${lineAndColumn}`;
    }

    getDate() {
        return new Date().toLocaleString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
            timeZone: this.timeZone
        });
    }

    formatMessage(message) {
        const spaces = message.map(m => typeof m === 'object' ? m instanceof Error ? m.message : this.stringify(m, 2) : m).join(' ');
        const noSpaces = message.map(m => typeof m === 'object' ? m instanceof Error ? m.message : this.stringify(m, 0) : m).join(' ');

        return { spaces, noSpaces };
    }

    stringify(obj, space = 2) {
        const set = new WeakSet();

        return JSON.stringify(obj, (key, value) => {
            if (typeof value === 'object' && value) {
                return set.has(value) ? '[Circular Reference]' : (set.add(value), value);
            }
            return value;
        }, space);
    }

    resetLogFiles() {
        this.info('Resetting log files');

        Object.values(this.files).forEach(file => typeof file === 'string' && fs.writeFileSync(file, ''));

        return this;
    }
}

module.exports = Logger;
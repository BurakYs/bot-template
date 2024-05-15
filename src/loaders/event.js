const { glob } = require('glob');

module.exports = async (client) => {
    const eventFiles = glob.sync('./src/events/**/*.js');

    eventFiles.map(async (value) => {
        const event = require(`../../${value.replace(/\\/g, '/')}`);
        if (!event.load) return;

        client[event.once ? 'once' : 'on'](event.name, (...params) => event.run(client, ...params));
    });
};
const builder = require('botbuilder');
const hello = require('./dialogs/hello');

module.exports = function (connector) {
    const inMemoryStorage = new builder.MemoryBotStorage();
    const bot = new builder.UniversalBot(connector).set('storage', inMemoryStorage);
    bot.dialog('/', hello);

    return bot;
}
const botBuilder = require('botbuilder');
const botTester = require('bot-tester');

const connector = new botTester.TestConnector({
    defaultAddress: botBuilder.IAddress
});
const testBot = function (connector, dialogs) {
    const inMemoryStorage = new botBuilder.MemoryBotStorage();
    const bot = new botBuilder.UniversalBot(connector).set('storage', inMemoryStorage);

    for (let path in dialogs) {
        bot.dialog(path, dialogs[path]);
    }

    return bot;
}
module.exports = {
    connector: connector,
    testBot: testBot,
    botTester: botTester
}
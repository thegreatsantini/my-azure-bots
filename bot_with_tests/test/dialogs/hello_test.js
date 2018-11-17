const helper = require('../test_helper');
const hello = require('../../lib/dialogs/hello');

describe('hello', function () {
    let bot;
    let botTester;
    this.timeout(15000);

    beforeEach(function () {
        bot = helper.testBot(helper.connector, {
            '/': hello
        })
        botTester = new helper.botTester.BotTester(bot)
    });

    it('says hello to Stuart', function () {
        return botTester
            .sendMessageToBot('Get Started', 'What is your name?')
            .sendMessageToBot('Stuart', 'Hello friend')
            .runTest();
    })

    it('says hello to a stranger', function () {
        return botTester
            .sendMessageToBot('Get Started', 'What is your name?')
            .sendMessageToBot('Martin', 'Welcome stranger')
            .runTest();
    })

})
require('dotenv').config()
const restify = require('restify');
const builder = require('botbuilder');
const server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});
const connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_BOT_APP_ID,
    appPassword: process.env.MICROSOFT_BOT_APP_PASSWORD
});
const bot = require('./lib/bot')(connector);
server.post('/api/v1/messages', connector.listen());
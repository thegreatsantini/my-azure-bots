require('dotenv').config()
const restify = require('restify');
const builder = require('botbuilder');
const http = require('http');

const server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('listening to %s', server.url);
});

const connector = new builder.ChatConnector({
    appId: process.env.APP_ID,
    appPassword: process.env.APP_PASSWORD
});
const bot = new builder.UniversalBot(connector);

server.post('/api/messages', connector.listen());

bot.dialog('/', function (session, args) {
    if (!session.userData.greeting) {
        session.send("Hello. What is your name?");
        session.userData.greeting = true;
    } else if (!session.userData.name) {
        getName(session);
    } else if (!session.userData.email) {
        getEmail(session);
    } else if (!session.userData.password) {
        getPassword(session);
    } else {
        session.userData = null;
    }
    session.endDialog();
});

function getName(session) {
    name = session.message.text;
    session.userData.name = name;
    session.send("Hello, " + name + ". What is your Email ID?");
}
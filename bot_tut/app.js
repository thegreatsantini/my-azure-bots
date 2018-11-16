const restify = require('restify');
const builder = require('botbuilder');
const request = require('request');
// Setup Restify Server 
const server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978,
    function () {
        console.log('%s listening to %s', server.name, server.url);
    });
// chat connector for communicating with the Bot Framework Service 
const connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
// Listen for messages from users  
server.post('/api/messages', connector.listen());

const bot = new builder.UniversalBot(connector);

bot.on('conversationUpdate', function (message) {
    if (message.membersAdded[0].id === message.address.bot.id) {
        var reply = new builder.Message()
            .address(message.address)
            .text("Hello, I'm careBOTyou! How's your day going?");
        bot.send(reply);
    }
});

bot.dialog('/', function (session) {
    unirest.get("")
        .header("X-Mashape-Key", "9eNVDKsrfxmshX7ScjFOdZ0PaihMp10A8INjsnB9B31dBTRZgs")
        .header("Accept", "application/json")
        .end(function (result) {
            console.log(result.status, result.headers, result.body);
        });
    const uri = `https://irythia-hs.p.mashape.com/card?name=${cardName}`
    request.get(uri, (err, res, body) => {
        const response = JSON.parse(body)
        session.send("You said: %s", response.english);
        // console.log(body['english'])
    })
});
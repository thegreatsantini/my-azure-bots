const restify = require('restify');
const builder = require('botbuilder');
const request = require('request');
require('dotenv').config()
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
            .text("Welcome to my Hearthstone Bot");
        bot.send(reply);
    }
});

bot.dialog('/', function (session) {
    const input = session.message.text;

    if (input.substring(0, 12) === "/hearthstone") {
        // getting just the card name from user input and capitalizing each word for API
        const cardName = input.substring(12, input.length).trim().split(' ').map(val => val.charAt(0).toUpperCase() + val.substring(1, val.length)).join(' ')

        const options = {
            url: `https://irythia-hs.p.mashape.com/card?name=${cardName}`,
            headers: {
                'X-Mashape-Key': process.env.MASHUP_KEY,
                "Accept": "application/json"
            }
        };

        request.get(options, (err, res, body) => {

            if (res.statusCode !== 200) {
                session.send("Something went wrong when fetching your card info")
            } else {


                const response = JSON.parse(body)
                console.log(response)
                const cleanRes = (text) => {
                    if (!text) return 'N/A';

                    return text.replace(/<\/?[^>]+(>|$)/g, "");
                }
                var msg = new builder.Message(session)
                    .addAttachment({
                        contentType: "application/vnd.microsoft.card.adaptive",
                        content: {
                            type: "AdaptiveCard",
                            body: [
                                {
                                    "type": "Container",
                                    "items": [
                                        {
                                            "type": "ColumnSet",
                                            "columns": [
                                                {
                                                    "type": "Column",
                                                    "items": [
                                                        {
                                                            "type": "TextBlock",
                                                            "horizontalAlignment": "Center",
                                                            "size": "Large",
                                                            "weight": "Bolder",
                                                            "text": `${cleanRes(response.name)}`,
                                                            "wrap": true
                                                        },
                                                        {
                                                            "type": "TextBlock",
                                                            "horizontalAlignment": "Center",
                                                            "spacing": "None",
                                                            "text": `Race: ${cleanRes(response.race)}`,
                                                            "isSubtle": true,
                                                            "wrap": true
                                                        }
                                                    ],
                                                    "width": "stretch"
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    "type": "Container",
                                    "items": [
                                        {
                                            "type": "TextBlock",
                                            "text": `${cleanRes(response.description)}`,
                                            "wrap": true
                                        },
                                        {
                                            "type": "FactSet",
                                            "facts": [
                                                {
                                                    "title": "Cost:",
                                                    "value": `${response.cost || 'N/A'}`
                                                },
                                                {
                                                    "title": "Attack:",
                                                    "value": `${response.attack || 'N/A'}`
                                                },
                                                {
                                                    "title": "Health:",
                                                    "value": `${response.health || 'N/A'}`
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ],
                        }
                    })
                session.send(msg);
            }
        })
    } else {
        session.send('enter /hearthstone <card name> to view card details')
    }
});
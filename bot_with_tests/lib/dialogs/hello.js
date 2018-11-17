const builder = require('botbuilder');
module.exports = [
    function (session, results) {
        builder.Prompts.text(session, 'What is your name?');
    },
    function (session, result) {
        if (result.response == 'Stuart') {
            session.endDialog('Hello friend')
        } else {
            session.endDialog('Welcome stranger')
        }
    }
]
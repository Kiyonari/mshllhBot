const BaseModule = require("./BaseModule.js")
const fs = require("fs");
const ScoreHandler = require("./ScoreHandler.js")

class ScoreReactAdd extends BaseModule {
    process(message) {
        message.awaitReactions(() => {
            return true
        },
        {
            time: 600000
        })
        .then(collected => {
            let reactingUsers = [];
            collected.forEach(reaction => {
                reaction.users.forEach(user => {
                    if (!reactingUsers.includes(user.id)) {
                        reactingUsers.push(user.id);
                    }
                })
            });
            if (reactingUsers.length >= 3) {
                ScoreHandler.addScore(message, 1, "Tes pairs ont approuvé tes dires.");
            }
        })
        .catch(console.error);
    };
}

module.exports = new ScoreReactAdd({
    triggered_at: "message",
    triggered_when_command: false
})

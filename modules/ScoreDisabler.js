const BaseModule = require("./BaseModule.js")
const fs = require("fs")
const ScoreHandler = require('./ScoreHandler.js');

class ScoreDisabler extends BaseModule {
    canProcess(message) {
        return message.content.startsWith(this.constants.command_prefix + "disableScore") ||
                message.content.startsWith(this.constants.command_prefix + "enableScore");
    }

    process(message) {
        const writerID = message.author.id;
        const buffer = fs.readFileSync("db/score.csv", () => { }).toString();
        const lines = buffer.split('\n');
        let alreadyHasScore = false;
        let newBuffer = "";

        lines.forEach(element => {
            const user = element.split(';');
            const userID = user[0];
            let userScore = user[1];
            let userConsent = user[2];

            if (writerID === userID) {
                alreadyHasScore = true;
                userConsent = this.getUserConsent(message);
                if (!userConsent) {
                    this.getBackToNormalName(message);
                } else {
                    ScoreHandler.changeUserName(message, userScore);
                }
            }
            if (userID) {
                newBuffer += userID + ";" + userScore + ";" + userConsent + "\n";
            }
        });

        if (!alreadyHasScore) {
            newBuffer += writerID + ";0;" + this.getUserConsent(message) + "\n";
        }

        fs.writeFileSync("db/score.csv", newBuffer, () => { });
    }

    getUserConsent(message) {
        return message.content.includes("disableScore") ? false : true;
    }

    getBackToNormalName(message, score) {
        let nickname = message.guild.members.get(message.author.id).nickname;
        const regex = new RegExp(/^\[[\d]+\]/, 'gm');
        nickname = nickname.replace(regex, '');
        message.guild.members.get(message.author.id).setNickname(nickname);
    }
}

module.exports = new ScoreDisabler({
    triggered_at: "message",
})

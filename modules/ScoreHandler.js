const BaseModule = require("./BaseModule.js")
const fs = require("fs");

class ScoreHandler extends BaseModule {
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
            const userConsent = user[2];

            if (writerID === userID) {
                userScore++;
                if (userConsent === "true") {
                    this.changeUserName(message, userScore);
                    this.sendSwagNotification(message, userScore);
                }
                alreadyHasScore = true;
            }
            if (userID) {
                newBuffer += userID + ";" + userScore + ";" + userConsent + "\n";
            }
        });

        if (!alreadyHasScore) {
            newBuffer += writerID + ";1;true\n";
            this.changeUserName(message, 1);
            this.sendSwagNotification(message, 1);
        }

        fs.writeFileSync("db/score.csv", newBuffer, () => { });
    }

    changeUserName(message, score) {
        let nickname = message.guild.members.get(message.author.id).nickname;
        const newScore = '[' + score + ']';
        const regex = new RegExp(/^\[[\d]+\]/, 'gm');
        nickname = nickname.replace(regex, newScore);
        if (!nickname.startsWith('[')) {
            nickname = newScore + nickname;
        }
        message.guild.members.get(message.author.id).setNickname(nickname);
    }

    sendSwagNotification(message, score) {
        let messageBravo = "";
        if (score > 50) {
            messageBravo = "Bravo à <@" + message.author.id + "> qui accumule un " + score + "ème point de swag ! A ce niveau là ça en devient indécent wlh";
        } else if (score > 30) {
            messageBravo = "Bravo à <@" + message.author.id + "> qui accumule un nouveau point de swag ! Ca t'en fait déjà " + score + " c'est plutôt solide";
        } else if (score > 15) {
            messageBravo = "Bravo à <@" + message.author.id + "> qui a maintenant " + score + " points de swag. C'est pas mal mais tu peux mieux faire petit mskn";
        } else if (score === 1) {
            messageBravo = "<@" + message.author.id + "> vient de gagner son 1er point de swag ! J'suis fier de toi chef."
        } else {
            messageBravo = "<@" + message.author.id + "> continue son ascension sociale ! Il a maintenant " + score + " points de swag !";
        }
        message.channel.send(messageBravo, {
            tts: true
        });
    }
}

module.exports = new ScoreHandler({
    triggered_at: "message",
    trigger_probability: 1,
    triggered_when_command: false
})

const BaseModule = require("./BaseModule.js")
const fs = require("fs")

class ScoreNotifier extends BaseModule {
    canProcess(message) {
        return message.content.startsWith(this.constants.command_prefix + "score");
    }

    process(message) {
        const writerID = message.author.id;
        const buffer = fs.readFileSync("db/score.csv", () => { }).toString();
        const lines = buffer.split('\n');
        let alreadyHasScore = false;

        lines.forEach(element => {
            const user = element.split(';');
            const userID = user[0];
            let userScore = user[1];
            let userConsent = user[2];

            if (writerID === userID) {
                alreadyHasScore = true;
                this.sendScoreInfo(message, userScore, userConsent);
            }
        });

        if (!alreadyHasScore) {
            this.sendScoreInfo(message, 0, "true");
        }
    }

    sendScoreInfo(message, score, consent) {
        let consentText = consent === "true" ? "activé" : "désactivé";
        let messageInfo = "<@" + message.author.id + "> possède " + score + " swagpoints.\n" +
        "Il a " + consentText + " l'affichage des swagpoints dans son nom\n" +
        "!disableScore pour désactiver l'affichage, !enableScore pour le réactiver";
        message.channel.send(messageInfo);
    }
}

module.exports = new ScoreNotifier({
    triggered_at: "message",
    triggered_when_command: true
})

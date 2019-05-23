const Discord = require('discord.js')
const {prefix, token} = require('./config.json')
const Logger = require("@elian-wonhalf/pretty-logger")
const Quote = require('./quote.js')
const fs = require('fs');
const gag = require("./9gag.js");
const client = new Discord.Client()
const mshllh = ["mashallah", "mshllh"];

const bot_id = 456480783364784128

client.on('ready', () => console.log(`Logged as ${client.user.tag}`));

/*client.on('typingStart', (channel, user) => {
    setTimeout(() => {
        if (user.typingIn(channel)) {
            channel.send("Bon alors <@" + user.id + "> tu vas te grouiller d'envoyer ton message ou je peux te promettre que ça va pas aller entre toi et moi.");
        }
    }, 20000);
});*/

client.on('messageDelete', function(message) {
    var txt = ""
    if (message.author.id == bot_id) {
        txt = "C'est qui le fdp qui me censure ? On se croirait chez les bolcheviks >:("
        txt += "\n" + message.content
    } else {
        txt = "Genre t'as cru que t'allais t'en sortir comme ça <@" + message.author.id + ">"
        if (message.content.includes("fdp")) {
            txt += "\nEt puis c'toi le fdp d'abord"
        }
        txt += "\nLe voilà ton message pour la peine: \"" + message.content + "\""
    }
    message.channel.send(txt)
})

client.on('messageUpdate', function(old_message, new_message) {
    if (new_message.author.id != bot_id) {
        new_message.channel.send("J'ai tout vu <@" + new_message.author.id + "> <:aerW:456464580328161280>\nEn vrai t'as dit \"" + old_message.content + "\"")
    }
})

client.on('message', message => {
    if (message.author.id != bot_id && (newRandom() == 42)) {
        message.author.send({ file: "./mashallah.jpg" }).catch(Logger.exception);
    }

    if (message.author.id == bot_id) {
        return;
    }
    if (message.content.match(/💙|❤|💚|💜|🖤|💛|\\<3|<3/) && newRandom() > 50) {
        message.channel.send("#NoHomo bien sûr")
    }

    if (!message.content.startsWith(prefix)) {
        sentence = message.content.split(' ')
        for (word = 0; word < sentence.length; word++) {
            for (var i = 0; i < mshllh.length; i++) {
                if (sentence[word].toLowerCase() === mshllh[i]) {
                    message.channel.send({ file: "./mashallah.jpg" }).catch(Logger.exception);
                    break;
                }
            }
        }
    }

    gag.replace9GagVideo(message);

    if (message.content.startsWith(`${prefix}quote`)) {
        quote = Quote.quote(message);
        return;
    }

    if (message.content.startsWith(`${prefix}gay`)) {
        var gays = message.content.split(' ');
        console.log(message.content);
        if (gays.length !== 3) {
            return;
        }
        const pourcentagePd = newRandom();
        var emojiPd = "";
        if (pourcentagePd < 30) {
            emojiPd = ":skull:";
        } else if (pourcentagePd > 70) {
            emojiPd = ":gay_pride_flag:";
        } else if (pourcentagePd === 69) {
            emojiPd = client.emojis.find("name", "aerW");
        } else if (pourcentagePd === 100) {
            emojiPd = ":gay_pride_flag: :gay_pride_flag: :gay_pride_flag:";
        } else if (pourcentagePd === 0) {
            emojiPd = ":skull: :skull: :skull:";
        }
        message.channel.send(gays[1] + " et " + gays[2]+ " sont " + pourcentagePd + "% pd " + emojiPd);
        return;
    }

    const repeatRandom = Math.floor(Math.random() * Math.floor(300) + 1);
    console.log(repeatRandom, message.author.bot);
    if (repeatRandom <= 2 && !message.author.bot) {
        spongeBobFunction(message);
    } else if (repeatRandom >= 299 && !message.author.bot) {
        fdpFunction(message);
    } else if ((repeatRandom === 69 || repeatRandom === 42) && !message.author.bot) {
        everyoneFunction(message);
    } else if ((repeatRandom === 100 || repeatRandom === 200) && !message.author.bot) {
        message.react("👌");
    }
});

function everyoneFunction(message) {
    message.channel.send("@everyouane :point_up: :ok_hand:");
}

function fdpFunction(message) {
    message.channel.send(message.content + " fdp", {
        tts: true
    });
}

function newRandom() {
    return Math.floor(Math.random() * 101)
}

function spongeBobFunction(message) {
    str = message.content.toLowerCase().split(' ')
    line = ""
    for (var h = 0; h < str.length; h++) {
        for (var i = 0; i < str[h].length; i++) {
            if ((i % 2) == 0) {
                line += str[h][i].toUpperCase()
            } else {
                line += str[h][i]
            }
        }
        line += ' '
    }
    message.channel.send(line);
}

client.login(token);


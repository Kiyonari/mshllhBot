const Discord = require('discord.js')
const {prefix, token} = require('./config.json')
const Logger = require("@elian-wonhalf/pretty-logger")
const Quote = require('./quote.js')
const fs = require('fs');

const client = new Discord.Client()
const mshllh = ["mashallah", "mshllh"];

client.on('ready', () => console.log(`Logged as ${client.user.tag}`));

client.on('message', message => {
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
        const pourcentagePd = Math.floor(Math.random() * Math.floor(101));
        var emojiPd = "";
        if (pourcentagePd < 30) {
            emojiPd = " :skull:";
        } else if (pourcentagePd > 70) {
            emojiPd = " :gay_pride_flag:";
        }
        message.channel.send(gays[1] + " et " + gays[2]+ " sont " + pourcentagePd + "% pd" + emojiPd);
        return;
    }

    const repeatRandom = Math.floor(Math.random() * Math.floor(300) + 1);
    console.log(repeatRandom, message.author.bot);
    if (repeatRandom <= 1 && !message.author.bot) {
        spongeBobFunction(message);
    } else if (repeatRandom >= 300 && !message.author.bot) {
        fdpFunction(message);
    }
});

function fdpFunction(message) {
    message.channel.send(message.content + " fdp");
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

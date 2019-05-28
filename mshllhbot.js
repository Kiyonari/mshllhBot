const client_config = require('./config.json')
const Discord = require('discord.js')
const client = new Discord.Client()
const constants = require("./constants.js")
const configuration = process.argv[2] && process.argv[2] === "--dev" ? require("./configuration-dev.js") : require("./configuration.js")
const Utils = require("./Utils.js")

let modules = {}

client.on('ready', () => console.log(`Logged as ${client.user.tag}`));
configuration.modules.forEach(function(name) {
    var mod = new require("./modules/" + name + ".js")
    mod.client = client
    mod.constants = constants
    if (!modules[mod.config.triggered_at]) {
        modules[mod.config.triggered_at] = {}
    }
    modules[mod.config.triggered_at][name] = mod
})

configuration.events.forEach(function(event_name) {
    client.on(event_name, function(p1, p2, p3) {
        if (modules[event_name] && configuration.events_configuration[event_name](p1, p2, p3)) {
            for (c in modules[event_name]) {
                let mod = modules[event_name][c]
                if ((mod.config.trigger_probability ? Utils.rand() <= mod.config.trigger_probability : true) && mod.canProcess(p1, p2, p3)) {
                    mod.process(p1, p2, p3)
                    if (mod.config.stop_propagation) {
                        return;
                    }
                }
            }
        }
    })
})

client.login(client_config.token);


var Channel = require("./Channel.js");

class ChannelFactory {
	constructor() {
		this.channels = []
	}

	create(data) {
		var channel = new Channel(data)
		channel.constants = this.constants
		channel.globals = this.globals
		channel.game = this.game
		channel.init()
		this.channels.push(channel)
		return channel
	}

	add(obj) {
		obj.constants = this.constants
		obj.globals = this.globals
		obj.game = this.game
		obj.init()
		this.commands.push(obj)
		return obj
	}

	getDefaultLobby() {
		return this.channels.find((i) => (i.id == 'lobby'))
	}

	getDiscordChannel(key, value) {
		return this.globals.discord.guild.channels.find((chan) => (chan[key] == value))
	}

	get(id) {
		return this.findUnique((i) => (i.id == id))
	}

	find(fn) {
		var res = []
		for (var channel of this.channels) {
			if (fn(channel)) {
				res.push(channel)
			}
		}
		return res
	}

	findUnique(fn) {
		return this.channels.find(fn)
	}

	all(fn = null) {
		if (fn) {
			this.channels.forEach(fn)
		}
		return this.channels
	}
}

module.exports = new ChannelFactory();

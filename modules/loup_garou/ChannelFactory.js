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
		this.commands.push(obj)
		obj.constants = this.constants
		obj.globals = this.globals
		return obj
	}

	getDefaultLobby() {
		return this.channels.find((i) => (i.id == 'lobby'))
	}

	getDiscordChannel(key, value) {
		return this.globals.discord.guild.channels.find((chan) => (chan[key] == value))
	}

	get(id) {
		return this.find((i) => (i.id == id))
	}

	find(fn) {
		return this.channels.find(fn)
	}
}

module.exports = new ChannelFactory();

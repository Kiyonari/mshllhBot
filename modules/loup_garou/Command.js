
class Command {
	constructor(data) {
		for (var i in data) {
			this[i] = data[i]
		}
	}

	init() {
	}

	canExec(message, args) {
		return true
	}

	exec(message, args) {
		this.globals.log.send(`${this.globals.commands.format(this.id)}: Commande pas encore implémentée`)
	}

	getChannelsList() {
		var list = []
		for (var chan of this.authorized_channels) {
			list.push(this.globals.channels.get(chan).discord.channel.name)
		}
		return `\`${list.join(", ")}\``
	}
}

module.exports = Command;

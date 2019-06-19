var Command = require("./Command.js");

class CommandFactory {
	constructor() {
		this.commands = []
	}

	create(data) {
		var command = new Command()
		command.constants = this.constants
		command.globals = this.globals
		command.game = this.game
		command.init(data)
		this.commands.push(command)
		return command
	}

	add(obj) {
		this.commands.push(obj)
		obj.constants = this.constants
		obj.globals = this.globals
		obj.game = this.game
		return obj
	}

	findById(id) {
		return this.commands.find((i) => (i.id == id))
	}

	format(cmd) {
		return `\`${this.constants.command_prefix + this.config.command_name} ${cmd}\``
	}

}


module.exports = new CommandFactory()

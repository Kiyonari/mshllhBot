const BaseModule = require("./BaseModule.js")
const Utils = require("../Utils.js")

class LesTerroristesDeThiercelieux extends BaseModule {
	constructor(conf) {
		conf.command_name = "graou";
		conf.channel_name = "les-terroristes-de-thiercelieux"
		super(conf)
		this.initData()
	}

	canProcess(message) {
		return message.content.split(" ")[0] == this.constants.command_prefix + this.config.command_name
	}

	process(message) {
		this.parseCommand(message.content)
		if (this.data.commands[this.data.command.name]) {
			this[this.data.commands[this.data.command.name]](message)
		} else {
			var channel = this.data.init ? this.data.channel : message.channel
			channel.send("<@" + message.author.id + "> a encore fait de la merde, ` " + this.generateCommand(this.data.command.name) + " ` ça existe pas :rage:")
		}
	}


// GAME COMMANDS


	commandInit(message) {
		this.data.channel = message.guild.channels.find('name', this.config.channel_name)
		this.data.init = true
	}

	commandRegister(message) {
		if (!this.checkIfInitialized(message)) {
			return ;
		}
		console.log("commandRegister")
		this.data.channel.send("register")
	}

	commandLaunch(message) {
		console.log("commandLaunch")
	}

	commandVote(message) {
		console.log("commandVote")
	}

	commandStop(message) {
		console.log("commandStop")
	}


// INIT AND MISC


	checkIfInitialized(message) {
		if (!this.data.init) {
			message.channel.send("Mshllh du calme voyons, fais d'abord un ` " + this.generateCommand("init") + " ` avant <@" + message.author.id + ">")
			return false;
		}
		return true
	}

	initData() {
		this.data = {
			started: false,
			init: false,
			members: [],
			commands: {
				"init": "commandInit",
				"register": "commandRegister",
				"launch": "commandLaunch",
				"vote": "commandVote",
				"stop": "commandStop",
			},
			command: {
				args: null,
				name: null,
			},
			channel: null,
		}
	}

	parseCommand(txt) {
		var cmd = txt.split(" ")
		cmd.splice(0, 1)
		this.data.command.name = cmd.splice(0, 1)[0]
		this.data.command.args = cmd
	}

	generateCommand(cmd) {
		return this.constants.command_prefix + this.config.command_name + " " + cmd
	}
}

module.exports = new LesTerroristesDeThiercelieux({
	triggered_at: "message"
})

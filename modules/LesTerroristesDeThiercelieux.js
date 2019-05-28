const BaseModule = require("./BaseModule.js")

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
		console.log(this.data.command.name)
//		this.data.commands[this.data.command.name](message)
	}


// GAME COMMANDS


	commandInit(message) {
		this.data.channel = message.guild.channels.find('name', this.config.channel_name)
		console.log("commandInit")
	}

	commandRegister(message) {
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


	initData() {
		this.data = {
			started: false,
			members: [],
			commands: {
				"init": this.commandInit,
				"register": this.commandRegister,
				"launch": this.commandLaunch,
				"vote": this.commandVote,
				"stop": this.commandStop,
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
		this.data.command.cmd = cmd.splice(0, 1)
		this.data.command.args = cmd
	}
}

module.exports = new LesTerroristesDeThiercelieux({
	triggered_at: "message"
})

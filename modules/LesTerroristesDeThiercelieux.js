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
			this.send(`${this.generateCommand(this.data.command.name)} ça existe pas :rage:`, this.data.init ? this.data.channel : message.channel)
		}
	}


// GAME COMMANDS


	commandInit(message) {
		this.data.channel = message.guild.channels.find('name', this.config.channel_name)
		if (this.data.channel.id != message.channel.id) {
			this.send(`Faut le faire dans <#${this.data.channel.id}>, gardons ce serveur calme et serein :3`, message.channel)
		} else {
			this.data.init = true
		}
	}

	commandRegister(message) {
		if (!this.checkIfInitialized(message)) {
			return ;
		}
		this.registerMember(message.author, message.guild.members.get(message.author.id).nickname, this.parseCommand(message.content, false).slice(1))
	}

	commandLaunch(message) {
		if (!this.checkIfInitialized(message)) {
			return ;
		}
		console.log("commandLaunch")
	}

	commandVote(message) {
		if (!this.checkIfInitialized(message)) {
			return ;
		}
		console.log("commandVote")
	}

	commandStop(message) {
		console.log("commandStop")
	}


// REGISTER


	registerMember(member, nickname, custom_nickname) {
		nickname = nickname ? nickname : member.username
		var l = this.data.members.push({id: member.id, nickname: custom_nickname != "" ? custom_nickname : nickname, original_nickname: custom_nickname != "" ? nickname : null})
		this.send(`**${this.data.members[l - 1].nickname}** a rejoint la partie, ${["on s'enjaille", "on s'amuse", "vous pouvez quitter du coup", "niquez-le"][Utils.rand(3)]}`)
		console.log(this.data.members)
	}


// MESSAGING


	send(txt, channel = null) {
		(channel ? channel : this.data.channel).send(txt)
	}


// INIT AND MISC


	checkIfInitialized(message) {
		if (!this.data.init) {
			this.send(`Du calme voyons, faut d'abord un ${this.generateCommand("init")}`, message.channel)
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

	parseCommand(txt, fill_data = true) {
		var cmd = txt.split(" ")
		cmd.splice(0, 1)
		if (fill_data) {
			this.data.command.name = cmd[0]
			this.data.command.args = cmd.slice(1)
		}
		return cmd
	}

	generateCommand(cmd) {
		return `\`${this.constants.command_prefix + this.config.command_name} ${cmd}\``
	}
}

module.exports = new LesTerroristesDeThiercelieux({
	triggered_at: "message"
})

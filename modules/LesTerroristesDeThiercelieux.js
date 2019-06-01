const BaseModule = require("./BaseModule.js")
const Utils = require("../Utils.js")

const c_roles = {
	'werewolf': {
		name: "Péon",
	},
	'werewolf': {
		name: "Terroriste",
	},
}
const c_roles_list = ["villager", "werewolf"]

const c_rules = {
}

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
		this.data.guild = message.guild
		if (this.data.channel.id != message.channel.id) {
			this.send(`Faut le faire dans <#${this.data.channel.id}>, gardons ce serveur calme et serein :3`, message.channel)
		} else {
			this.data.init = true
			this.send(`Allez hop hop hop on fait un petit ${this.generateCommand("register (pseudo)")}, on se dépêche !`)
		}
	}

	commandRegister(message) {
		if (!this.checkIfInitialized(message)) {
			return ;
		}
		if (this.data.started) {
			this.send(`Déso <@${message.author.id}>, c'est déjà lancé, t'avais qu'à être à l'heure wlh`)
		} else {
			this.registerMember(message.author, message.guild.members.get(message.author.id), this.parseCommand(message.content, false).slice(1))
		}
	}

	commandStart(message) {
		if (!this.checkIfInitialized(message)) {
			return ;
		}
		// if (this.data.members.length < 2) {
		// 	this.send("Y'a même pas 2 personnes, ça va être triste, même pas je lance :cry:")
		// 	this.reset()
		// } else {
			this.data.started = true
			this.start()
		// }
		console.log("commandStart")
	}

	commandVote(message) {
		if (!this.checkIfInitialized(message)) {
			return ;
		}
		console.log("commandVote")
	}

	commandStop(message) {
		this.send("C'est stoppé! De toute façon vous êtes tous nuls alors bon")
		this.reset()
		console.log("commandStop")
	}


// GAME


	start() {
		var notifs = ""
		this.data.members.forEach(function(member) {
			notifs += "<@" + member.id + "> "
		})
		this.send(`${notifs}Allez on est tipar ! J'attribue les rôles maintenant, checkez vos DM :3`)
		this.setRoles()
	}

	setRoles() {
		var _this = this
		var conf = c_rules
		var shuffled = this.shuffle(this.data.members)
		shuffled.forEach(function(member) {
		})
	}


// STOP


	reset() {
		for (var i in this.data.members) {
			if (this.data.members[i].original_nickname) {
				message.guild.members.get(this.data.members[i].id).setNickname(this.data.members[i].original_nickname)
			}
		}
		this.data.members = []
		this.data.init = false
		this.data.started = false
	}


// REGISTER


	registerMember(member, guild_member, custom_nickname) {
		var found = false
		var data = this
		this.data.members.forEach(function(item) {
			if (item.id == member.id) {
				data.send(`Wlh <@${member.id}> tu croyais m'avoir, on se register pas 2 fois comme ça ici :rage:`)
				found = true
			}
		})
		if (found) {
			return
		}
		custom_nickname = custom_nickname.length ? custom_nickname[0] : ""
		var nickname = guild_member.nickname ? guild_member.nickname : member.username
		var final_nickname = custom_nickname != "" ? custom_nickname : nickname
		var final_original_nickname = custom_nickname != "" ? nickname : null
		this.data.members.push({id: member.id, nickname: final_nickname, original_nickname: final_original_nickname})

		this.send(`**${final_nickname}** a rejoint la partie, ${["on s'enjaille", "on s'amuse", "vous pouvez quitter du coup"][Utils.rand(2)]}`)
		guild_member.setNickname(final_nickname)
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
				"start": "commandStart",
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

	shuffle(array) {
    let counter = array.length;
    while (counter > 0) {
        let index = Utils.rand(counter - 1);
        counter--;
        let temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }

    return array;
}
}

module.exports = new LesTerroristesDeThiercelieux({
	triggered_at: "message",
	triggered_when_command: true
})

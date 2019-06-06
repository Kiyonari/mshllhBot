const BaseModule = require("./BaseModule.js")
const Utils = require("../Utils.js")

const Discord = require("discord.js")

const c_roles = [
	{
		id: 'villager',
		name: "Péon",
		ratio: 1,
	},
	{
		id: 'werewolf',
		name: "Terroriste",
		ratio: 0.4,
		mandatory: true
	},
	{
		id: 'hunter',
		name: "Cancer",
		fixed_number: 1,
		ratio: 0.1,
	},
	{
		id: 'clairvoyant',
		name: "Témoin de Jéhovah",
		fixed_number: 1,
		ratio: 0.1,
	},
	{
		id: 'cupidon',
		name: "Bébé avec un arc qui vole",
		ratio: 0.1,
		fixed_number: 1,
	},
	{
		id: 'witch',
		name: "Chimiothérapeute",
		fixed_number: 1,
		ratio: 0.1
	}
]

const c_play_order_start = ["cupidon"]
const c_play_order = ["clairvoyant", "werewolf", "witch"]

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
		if (this.data.waiting_command && this.data.command.name != this.data.waiting_command) {
			this.send(`Calmons-nous <@${message.author.id}>, j'attends quelqu'un et après on verra pour toi :3`)
		} else {
			if (this.data.commands[this.data.command.name]) {
				this[this.data.commands[this.data.command.name]](message)
			} else {
				this.send(`${this.generateCommand(this.data.command.name)} ça existe pas :rage:`, this.data.init ? this.data.channel : message.channel)
			}
		}
	}


	commandTest(message) {
		// message.guild.createChannel('daesh', "text", {
		// 	permissionOverwrites: [{
		// 		id: "375433699732226050",

		// 	},
		// 	]
		// }).then(function() {
		// 	console.log("ok")
		// })

//		var perm = new Discord.Permissions(Discord.Permissions.ALL)
		message.guild.createChannel('daesh', {type: "text",
			permissionOverwrites: [
		  {
		  	id: message.guild.members.get("312922436691558422"),
		  	deny: ["SEND_MESSAGES"],
			},
			{
		    id: message.guild.members.get(message.author.id),
		    deny: ['SEND_MESSAGES'],
		  },
		  ]
		}).then(function() {
			console.log("coucou")
		})

//		message.guild.members.get(this.data.members[i].id)
	}

// GAME COMMANDS


	commandInit(message) {
		// this.data.init = true
		// this.data.started = true
		// this.data.members.push({id: 0, nickname: "a", original_nickname: null, role: 'werewolf'})
		// this.data.members.push({id: 1, nickname: "b", original_nickname: null, role: 'villager'})
		// this.data.members.push({id: 2, nickname: "c", original_nickname: null, role: 'werewolf'})
		// this.data.members.push({id: 3, nickname: "d", original_nickname: null, role: 'witch'})
		// this.data.members.push({id: 4, nickname: "e", original_nickname: null, role: 'hunter'})
		// this.setRoles()
		// return

		this.data.channel = message.guild.channels.find('name', this.config.channel_name)
		this.data.guild = message.guild
		if (this.data.channel.id != message.channel.id) {
			this.send(`Faut le faire dans <#${this.data.channel.id}>, gardons ce serveur calme et serein :3`, message.channel)
		} else {
			this.data.init = true
			this.send(`Allez hop hop hop on fait un petit ${this.generateCommand("register (pseudo)")}, on se dépêche !`)
			this.registerMember(message.author, message.guild.members.get(message.author.id), [])
		}
	}

	commandRegister(message) {
		if (!this.checkIfInitialized(message)) {
			return ;
		}
		if (this.data.started) {
			this.send(`Déso <@${message.author.id}>, c'est déjà lancé, t'avais qu'à être à l'heure :3`)
		} else {
			this.registerMember(message.author, message.guild.members.get(message.author.id), this.parseCommand(message.content, false).slice(1))
		}
	}

	commandStart(message) {
		if (!this.checkIfInitialized(message)) {
			return ;
		}
		if (this.data.members.length < 2) {
			this.send("Y'a même pas 2 personnes, ça va être triste, même pas je lance :cry:")
			this.reset()
		} else {
			this.data.turn = 0
			this.data.started = true
			this.start()
			this.launchStartTurn()
		}
	}

	commandVote(message) {
		if (!this.checkIfInitialized(message)) {
			return ;
		}
		// if (message.channel.type != "dm") {
		// 	this.send("Pas ici voyons ! faudrait pas que tout le monde te voie !", message.channel)
		// } else {
		// 	if (this.getMember('id', message.author.id).role != 'werewolf') {

		// 	}
		// 	// if (!this.data.init || !this.data.started) {
		// 	// 	this.send("Mshllh du calme, ça n'a même pas encore commencé", message.channel)
		// 	// }
		// 	var name = this.parseCommand(message.content, false)[1]
		// 	if (name) {
		// 		if (!this.getMember('name', name)) {
		// 			this.send(`<@${message.author.id}> n'existe pas :'(")
		// 		}
		// 		voteForMember(name)
		// 	} else {
		// 		this.send(`Un nom, ma parole, il me faut un nom ! Fais un ${this.generateCommand("list")} pour voir qui joue`)
		// 	}
		// }
	}

	commandStop(message) {
		this.send("C'est stoppé ! De toute façon vous êtes tous nuls alors bon")
		this.reset()
		console.log("commandStop")
	}

	commandList(message) {
		if (!this.checkIfInitialized(message)) {
			return ;
		}
		var _this = this
		var see_werewolves = false
		if (message.channel.type == "dm" && this.getMember('id', message.author.id) && this.getMember(message.author.id).role == "werewolf") {
			see_werewolves = true
		}
		var txt = "Joueurs présents: \n"
		this.data.members.forEach(function(member) {
			txt += `- \`${member.nickname}\``
			if (_this.data.started && member.role == "werewolf" && see_werewolves) {
				txt += `  -- **${_this.getRole(member.role).name}**`
			}
			txt += "\n"
		})
		this.send(txt, message.channel)
	}

	commandMarry(message) {
		if (!this.checkIfInitialized(message)) {
			return ;
		}
		if (this.data.waiting_command == 'marry' && this.data.turn == 0) {
			if (message.channel.type == "dm") {
				var m1 = this.getMember('nickname', this.data.command.args[0])
				var m2 = this.getMember('nickname', this.data.command.args[1])
				if (!m1 || !m2) {
					this.sendDM(`Y'en a un des 2 (ou les 2) qui n'existe(nt) pas...\nVoilà la liste:\n${this.getMembersList(this.data.members)}`)
				} else {
					this.marryMembers(m1, m2)
				}
				this.data.waiting_command = null
				this.data.turn = 1
				this.send("C'est tout bon, on peut commencer !")
			} else {
				this.send(`En DM <@${message.author.id}> stp, faudrait pas qu'on nous voit :3`, message.channel)
			}
		} else {
			this.send(`Pas si vite <@${message.author.id}>, tu peux pas faire ça maintenant !`, message.channel)
		}
	}

	marryMembers(m1, m2) {
		m1.married = m2.id
		m2.married = m1.id
		this.sendDM(`Eh bien tu es marié, félicitations ! _mskn_\n\nTon charmant partenaire est: **${m1.nickname}**`, m2.id)
		this.sendDM(`Eh bien tu es marié, félicitations ! _mskn_\n\nTon charmant partenaire est: **${m2.nickname}**`, m1.id)
	}

/*
 * GAME
 */


// TURNS

	werewolfTurn(startup = false) {
		if (startup) {
			var list = this.getMembersList(this.getMembers('werewolf'))
			var _this = this
			this.getMembers('werewolf').forEach(function(member) {
				_this.sendDM(`Voici tes coéquipiers: \n${list}`, member.id)
			})
		} else {
		}
	}

	cupidonTurn(startup = false) {
		var cupidon = this.getMember('role', 'cupidon')
		if (startup) {
			this.data.waiting_command = "marry"
			this.sendDM(`Voici les joueurs:\n${this.getMembersList(this.data.members)}\n\nFais un ${this.generateCommand("marry pseudo_1 pseudo_2")} pour lier 2 personnes entre elles _(c'est rigolo, on s'amuse)_`, cupidon.id)
		} else {
		}
	}

	villagerTurn(startup = false) {
		if (startup) {
		} else {
		}
	}

	hunterTurn(startup = false) {
		if (startup) {
		} else {
		}
	}

	clairvoyantTurn(startup = false) {
		if (startup) {
		} else {
		}
	}

	witchTurn(startup = false) {
		if (startup) {
		} else {
		}
	}


// START

	launchStartTurn() {
		this.send("Les Terroristes vont pouvoir se reconnaître, _ces fdp_, 2 secondes...")
		this.werewolfTurn(true)
		var _this = this
		setTimeout(function() {
			var next_timeout = 500
			var cupidon = _this.getMember('role', 'cupidon')
			_this.send("Maintenant au bébé avec un arc qui vole, notre ami à tous...")
			if (cupidon) {
				_this.cupidonTurn(true)
			} else {
				setTimeout(function() {
					_this.send("C'est tout bon, on peut commencer !")
				}, 4500 + Utils.rand(1500))
			}
		}, 500)
	}

	start() {
		var notifs = ""
		this.data.members.forEach(function(member) {
			notifs += "<@" + member.id + "> "
		})
		this.send(`${notifs}Allez on est tipar ! J'attribue les rôles maintenant, checkez vos DM :3`)
		this.setRoles()
		this.sendRoleDMs()
	}

	sendRoleDMs() {
		var _this = this
		this.data.members.forEach(function(member) {
			_this.sendDM(`Eh bien ton rôle est: **${_this.getRole(member.role).name}**, félicitations !`, member.id)
		})
	}

	setRoles() {
		var _this = this
		var conf = []
		for (var i in c_roles) {
			var role = {id: c_roles[i].id, mandatory: c_roles[i].mandatory ? true : false, optional: !c_roles[i].mandatory}
			if (c_roles[i].fixed_number) {
				role.ratio = c_roles[i].fixed_number
			} else {
				role.ratio = Math.floor(c_roles[i].ratio * this.data.members.length)
				if (role.ratio <= 0) {
					role.ratio = 1
				}
			}
			if (!role.mandatory && Utils.rand() % 3 == 0) {
				role.optional = true
			}
			if (role.mandatory || Utils.rand() % 4) {
				conf.push(role)
			}
		}
		conf.sort(function(a, b) {
			if ((a.ratio > b.ratio && !b.mandatory) || a.mandatory) {
				return -1;
			} else if (a.ratio == b.ratio) {
				return a.mandatory ? -1 : (b.mandatory ? 1 : 0)
			} else {
				return 1
			}
		})
		var shuffled = this.shuffle(this.data.members)
		var current_role_id = 0
		var current_role = conf[current_role_id]
		shuffled.forEach(function(member) {
			if (current_role.ratio > 0) {
				member.role = current_role.id
				current_role.ratio--;
				if (current_role.ratio == 0) {
					current_role_id++;
					current_role = current_role_id == conf.length ? 'villager' : conf[current_role_id]
				}
			}
		})
		this.data.members.forEach(function(member) {
			member.role = shuffled.find((i) => member.id == i.id).role
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
				data.send(`<@${member.id}> tu croyais m'avoir, on se register pas 2 fois comme ça ici :rage:`)
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

	sendDM(txt, id) {
		this.data.guild.members.get(id).send(txt)
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
				"list": "commandList",
				"marry": "commandMarry",

				"test": "commandTest"
			},
			command: {
				args: null,
				name: null,
			},
			channel: null,
			playing_role: "",
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

	getRole(role) {
		return c_roles.find((i) => (i.id == role))
	}

	getMember(key, value) {
		return this.data.members.find((i) => i[key] == value)
	}

	getMembers(role) {
		var members = []
		if (role) {
			this.data.members.forEach(function(member) {
				if (member.role == role) {
					members.push(member)
				}
			})
		} else {
			members = this.data.members
		}
		return members
	}

	getMembersList(array, show_role) {
		var txt = ""
		var _this = this
		array.forEach(function(member) {
			txt += ` - **${member.nickname}**${member.role == show_role || show_role == 'all' ? `  -- **${_this.getRole(member.role).name}**` : ``}\n`
		})
		return txt
	}
}

module.exports = new LesTerroristesDeThiercelieux({
	triggered_at: "message",
	triggered_when_command: true
})

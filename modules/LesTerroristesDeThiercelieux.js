const BaseModule = require("./BaseModule.js")

var _globals = require("./loup_garou/globals.js")

class Game {
	constructor() {
		this.init()
	}

	init() {
		this.status = 'stop'
		this.turn = {
			role: -1,
			id: 0,
			werewolf_data: {
				dead: null
			},
			clairvoyant_data: {
				found: null
			},
			witch_data: {
				dead: null
			},
			villager_data: {
				dead: null
			}
		}
		this.waiting_command = null
		this.initialized = false
		this.order = {
			start: ['cupidon'],
			default: ['clairvoyant', 'werewolf', 'witch']
		}
	}

	nextTurn(stacked = false) {
		console.log("nextTurn: " + this.turn.id + " (" + this.turn.role + ")")
		if (this.waiting_command == 'vote' && this.turn.id != 1) {
			console.log("calling villagerTurn")
			this.villagerTurn()
			return
		}
		var order = this.order[this.turn.id == 0 ? 'start' : 'default']
		console.log("order: " + (this.turn.id == 0 ? 'start' : 'default'))
		if (this.turn.role + 1 >= order.length) {
			console.log("arrived at the end")
			this.turn.role = -1
			this.turn.id++
			if (this.turn.id != 1) {
				console.log("playing newTurn")
				this.newTurn()
				console.log("stopped newTurn")
				return 'vote'
			} else {
				order = this.order['default']
			}
		}
		var playing_role = order[this.turn.role + 1]
		var played = false
		console.log("playing role " + playing_role)
		this.turn.role++
		_globals.roles.all(function(r) {
			if (r.id == playing_role && r.attributed) {
				console.log("calling method of Role " + r.id)
				r['play' + ((r.game.turn.id == 0) ? 'Start' : 'Default') + 'Turn']()
				played = true
			} else {
				console.log("disabling channel " + r.discord.channel.id)
				if (!stacked) {
					r.discord.channel.disable()
				}
			}
		})
		if (!played) {
			console.log("stacking")
			var ret = this.nextTurn(true)
			if (ret) {
				this.waiting_command = ret
			}
			console.log("popped last nextTurn")
			return ret
		}
		console.log("turn id at the end: " + this.turn.id)
	}

	newTurn() {
		var villager_channel = _globals.channels.get('villager-channel')
		villager_channel.send(`Le jour se lève sur Hénin-Beaumont...`)

		var deads = {
			'witch': this.turn.witch_data.dead,
			'werewolf': this.turn.werewolf_data.dead
		}
		var dead_nb = (deads.witch ? 1 : 0) + (deads.werewolf ? 1 : 0)

		if (dead_nb) {
			villager_channel.send(`\nEt nous avons ${dead_nb} mort${dead_nb > 1 ? 's' : ''} à déplorer :cry:`)
			var txt = ""
			if (deads.witch) {
				txt = `<@${deads.witch.id}>`
			}
			if (deads.werewolf) {
				txt += txt != "" ? ` et <@${deads.werewolf.id}>` : `<@${deads.werewolf.id}>`
			}

			villager_channel.send(txt + ` ${dead_nb > 1 ? 'sont allés' : 'est allé'} rejoindre ~~Allah~~ le Ciel :cry:`)
			if (deads.witch && deads.werewolf && deads.witch.married && deads.witch.married.id == deads.werewolf.id) {
				deads.werewolf = null
			}
			for (var role in deads) {
				var dead = deads[role]
				if (dead) {
					if (dead.married) {
						villager_channel.send(`Or il s'avère que <@${dead.id}> était marié à <@${dead.married.id}>... Quel dommaaaaaaage... :cry:`)
						dead.married.kill()
					}
					dead.kill()
				}
			}
			villager_channel.send(`Il reste donc ${_globals.members.all().length} personne${_globals.members.all().length > 1 ? 's' : ''} au village... Mais vous inquiétez pas, tout va très bien !`)
		} else {
			villager_channel.send(`\nEt nous n'avons aucun incident à déplorer ! La nuit fut parfaitement calme !`)
		}
		villager_channel.send(`\n\nIl est maintenant temps de voter pour votre prochaine victime, villageois ! Amusez-vous bien :3`)
		villager_channel.enable()
	}

	villagerTurn() {
		var villager_channel = _globals.channels.get('villager-channel')
		var dead = this.turn.villager_data.dead

		villager_channel.send(`Eh bien c'est <@${dead.id}> qui sera pendu haut et court jusqu'à ce que morts s'en suivent !`)
		if (dead.married) {
			villager_channel.send(`Or il s'avère que <@${dead.id}> était marié à <@${dead.married.id}>... Quel dommaaaaaaage... :cry:`)
			dead.married.kill()
		}
		dead.kill()
		villager_channel.send(`Il reste donc ${_globals.members.all().length} personne${_globals.members.all().length > 1 ? 's' : ''} au village... Mais vous inquiétez pas, tout va très bien !`)
		villager_channel.send(`\n\nAllez, au dodo !`)
		var _this = this
		setTimeout(function() {
			villager_channel.disable()
			_this.waiting_command = null
			_this.nextTurn()
		}, 300)
	}
}

var _game = null

class LesTerroristesDeThiercelieux extends BaseModule {
	constructor(conf) {
		conf.command_name = "graou";
		super(conf)
	}

	canProcess(message) {
		return message.content.split(" ")[0] == this.constants.command_prefix + this.config.command_name
	}

	process(message) {
		if (!_game || !_game.initialized) {
			this.init(message)
		}
		var channel = _globals.channels.findUnique((i) => (i.discord.id == message.channel.id))
		if (!channel) {
			_globals.log.send(`<@${message.author.id}> a fait un truc dans le channel \`${message.channel.name}\`, mais je ne le connais pas :'(`, message.channel)
		} else {
			var parsed = this.parseCommand(message.content)
			var command = _globals.commands.get(parsed.id)
			if (command) {
				if (!_game.waiting_command || (_game.waiting_command && (_game.waiting_command == command.id || command.overwrites_waiting_command))) {
					if (!command.authorized_channels.includes(channel.id)) {
						_globals.log.send(`Pas si vite <@${message.author.id}>, tu ne peux faire cette commande que dans ces channels: ${command.getChannelsList()} :3`, message.channel)
					} else if (!command.canExec(message, parsed.args)) {
						return;
					} else {
						command.exec(message, parsed.args)
					}
				} else {
					_globals.log.send(`Pas possible de faire la commande ${_globals.commands.format(command.id)} pour le moment, déso !`, message.channel)
				}
			} else {
				_globals.log.send(`${_globals.commands.format(parsed.id)} ça n'existe pas :rage:`, message.channel)
			}
		}
	}

	init(message) {
		_game = new Game()
		_globals.discord.guild = message.guild
		this.createChannels()
		this.createCommands()
		this.createRoles()
		this.initLog()
		_game.status = 'stop'
		_game.initialized = true
	}

	initLog() {
		_globals.log.config = this.config
		_globals.log.constants = this.constants
		_globals.log.game = _game
	}

	createRoles() {
		_globals.roles.config = this.config
		_globals.roles.constants = this.constants
		_globals.roles.game = _game
		for (var c of _globals.data.registered_roles) {
			_globals.roles.add(require("./loup_garou/role/" + c + "Role.js"))
		}
		// _globals.roles.create({ id: 'villager', name: "Péon", ratio: 1 })
		// _globals.roles.create({ id: 'werewolf', name: "Terroriste", ratio: 0.4, mandatory: true })
		// _globals.roles.create({ id: 'hunter', name: "Cancer", fixed_number: 1, ratio: 0.1 })
		// _globals.roles.create({ id: 'clairvoyant', name: "Témoin de Jéhovah", fixed_number: 1, ratio: 0.1 })
		// _globals.roles.create({ id: 'cupidon', name: "Bébé avec un arc qui vole", ratio: 0.1, fixed_number: 1 })
		// _globals.roles.create({ id: 'witch', name: "Chimiothérapeute", fixed_number: 1, ratio: 0.1 })
	}

	createCommands() {
		_globals.commands.config = this.config
		_globals.commands.constants = this.constants
		_globals.commands.game = _game
		for (var c of _globals.data.registered_commands) {
			_globals.commands.add(require("./loup_garou/command/" + c + "Command.js"))
		}

		// _globals.commands.create({id: 'init', required_status: 'init', authorized_channels: ['lobby'] })
		// _globals.commands.create({id: 'register', required_status: 'init', authorized_channels: ['lobby'] })
		// _globals.commands.create({id: 'start', required_status: 'init', authorized_channels: ['lobby'] })
		// _globals.commands.create({id: 'vote',required_status: 'start', authorized_channels: ['lobby'] })
		// _globals.commands.create({id: 'stop', required_status: 'init', authorized_channels: ['lobby'] })
		// _globals.commands.create({id: 'list', required_status: 'init', authorized_channels: ['lobby'] })
		// _globals.commands.create({id: 'marry',required_status: 'start', authorized_channels: [] })
		// _globals.commands.create({id: 'test', required_status: 'init', authorized_channels: ['lobby', 'history', 'general'] })
	}

	createChannels() {
		_globals.channels.config = this.config
		_globals.channels.constants = this.constants
		_globals.channels.game = _game
		_globals.channels.create({ id: 'lobby', discord: { id: '586174272687308830' }, lobby: true })
		_globals.channels.create({ id: 'history', discord: { id: '586169619564199956' }, lobby: true })
		_globals.channels.create({ id: 'general', discord: { id: '586168794087686145' }, lobby: true })
		_globals.channels.create({ id: 'villager-channel', role: 'villager', discord: { id: '586169842135072776' }, lobby: false })
		_globals.channels.create({ id: 'werewolf-channel', role: 'werewolf', discord: { id: '586171506673844234' }, lobby: false })
		_globals.channels.create({ id: 'witch-channel', role: 'witch', discord: { id: '586170490180337675' }, lobby: false })
		_globals.channels.create({ id: 'cupidon-channel', role: 'cupidon', discord: { id: '586176105116073994' }, lobby: false })
		_globals.channels.create({ id: 'clairvoyant-channel', role: 'clairvoyant', discord: { id: '586170550095708171' }, lobby: false })
		_globals.channels.create({ id: 'hunter-channel', role: 'hunter', discord: { id: '586170721341014056' }, lobby: false })
		_globals.channels.create({ id: 'dead-channel', role: 'dead', discord: { id: '586169866294394881' }, lobby: false })
	}

	parseCommand(txt) {
		var cmd = txt.split(" ")
		cmd.splice(0, 1)
		var obj = {id: cmd.splice(0, 1), args: cmd}
		return obj
	}
}

module.exports = new LesTerroristesDeThiercelieux({
	triggered_at: "message",
	triggered_when_command: true
})




/*


class LesTerroristesDeThiercelieux extends BaseModule {
	constructor(conf) {
		conf.command_name = "graou";
		conf.admin_role = '586169000623341588';
		super(conf)
		this.initData()
	}

	canProcess(message) {
		return message.content.split(" ")[0] == this.constants.command_prefix + this.config.command_name
	}

	process(message) {
		if (message.channel.type == "dm") {
			message.channel.send("Pas de DM :rage:")
			return
		}
		this.parseCommand(message.content)
		if (this.data.waiting_command && this.data.command.name != this.data.waiting_command) {
			this.send(`Calmons-nous <@${message.author.id}>, j'attends quelqu'un et après on verra pour toi :3`, this.data.status.length ? null : message.channel)
		} else {
			var command = this.data.commands.find((i) => (i.id == this.data.command.name))
			if (command) {
				if (this.canTriggerCommand(message, command)) {
					this[command.method](message)
				}
			} else {
				this.send(`${this.generateCommand(this.data.command.name)} ça existe pas :rage:`, this.data.status.length ? null : message.channel)
			}
		}
		this.flushCommand()
	}

	flushCommand() {
		this.data.command.name = null
		this.data.command.args = null
	}

	canTriggerCommand(message, command) {
		var current_channel = this.data.channels.config.find((i) => (i.discord_id == message.channel.id))
		if (!command.authorized_channels.includes(current_channel.id)) {
			var channels_list = []
			for (var chan of command.authorized_channels) {
				channels_list.push(this.data.channels.config.find((i) => (i.id == chan)).name)
			}
			this.send(`Calmons-nous <@${message.author.id}>, il faut faire ça dans un de ces channels: \`${channels_list.join(", ")}\``, message.channel)
			return false
		}
		if (command.needs_init) {
			if (command.needs_start) {
				if (this.data.status != 'start') {
					this.send(`Calmons-nous <@${message.author.id}>, faut d'abord faire un ${this.generateCommand("start")} pour ça !`, message.channel)
					return false
				}
				return true
			}
			if (this.data.status == 'start' || this.data.status == 'init') {
				return true
			} else {
				this.send(`Calmons-nous <@${message.author.id}>, faut d'abord faire un ${this.generateCommand("init")} pour ça !`, message.channel)
				return false
			}
			return true
		}
		return true
	}

	commandTest(message) {
		if (this.i != null) {
			this.i++
		} else {
			this.i = 0
		}
		if (this.i % 2 == 0) {
			this.enableChannel('villager')
//			message.guild.members.find((i) => (i.id == message.author.id)).addRole(this.config.admin_role)
		} else {
			this.disableChannel('villager')
//			message.guild.members.find((i) => (i.id == message.author.id)).removeRole(this.config.admin_role)
		}
	}

	initChannels(message) {
		for (var conf of this.data.channels.config) {
			var var_name = conf.id.replace('-', '_')
			this.data.channels[var_name] = this.getChannel('id', conf.discord_id)
			if (!this.data.channels[var_name]) {
				this.send(`Je ne trouve pas le channel \`${conf.name}\`, du coup RIP :'(`, message.channel)
				return false
			}
			this.flushChannel(this.data.channels[var_name], conf)
		}
		return true
	}

	flushChannel(channel, config) {
		if (config.role_channel) {
			channel.fetchMessages().then(messages => channel.bulkDelete(messages));
		}
	}

	commandInit(message) {
		this.reset()
		this.data.guild = message.guild
		if (this.initChannels(message)) {
			this.data.status = 'init'
			this.send(`Allez hop hop hop on fait un petit ${this.generateCommand("register (pseudo)")}, on se dépêche !`)
			this.registerMember(message.author, this.data.guild.members.get(message.author.id))
		}
	}

	commandRegister(message) {
		if (this.data.start) {
			this.send(`Déso <@${message.author.id}> mais c'est déjà lancé, t'avais qu'à être à l'heure :3`)
		} else {
			this.registerMember(message.author, this.data.guild.members.get(message.author.id))
		}
	}

	commandStart(message) {
		if (this.data.members.length < this.data.min_players) {
			this.send(`Y'a même pas ${this.data.min_players} personnes, ça va être triste, même pas je lance :cry:`)
			this.reset()
		} else {
			this.data.game.turn = 0
			this.data.status = 'start'
			this.start()
			this.nextTurn()
		}
	}

	nextTurn() {
		if (this.data.game.turn == 0) {
			this.launchStartTurn()
		}
	}

	commandVote(message) {
	}

	commandStop(message) {
		this.send("C'est stoppé ! De toute façon vous êtes tous nuls alors bon")
		this.reset()
	}

	commandList(message) {
	}

	commandMarry(message) {
	}


// TURNS

	werewolfTurn(step = 'turn') {
		var wolves = this.getMembers('role', 'werewolf')
		if (step == 'welcome') {
			this.send(`Coucou ! Bienvenue sur le channel réversé aux combattants de la liberté <3`, this.data.channels.werewolf_channel, 750)
		} else if (step == 'start') {
		} else {
		}
	}

	cupidonTurn(step = 'turn') {
		var cupidon = this.getMember('role', 'cupidon')
		if (!cupidon) {
			return
		}
		if (step == 'welcome') {
			this.send(`Coucou bébé qui pleure ! Tu vas pouvoir choisir 2 personnes qui vont s'aimer pour toujours :3`, this.data.channels.cupidon_channel, 750)
			this.data.waiting_command = "marry"
		} else if (step == 'start') {
			this.send(`Au tour du bébé qui vole, qui va unir pour leur plus grand bonheur 2 personnes parmi vous...`)
		}
	}

	villagerTurn(step = 'turn') {
		if (step == 'welcome') {
			this.send(`Vous êtes ici dans le fameux village de Hénin-Beaumont, ~~fief du FN~~ heureuse bourgade paisible et prospère !\nAucune attaque de terroristes en vue, vous pouvez dormir sur vos 2 oreilles !`, this.data.channels.villager_channel, 750)
		} else if (step == 'start') {
		} else {
		}
	}

	hunterTurn(step = 'turn') {
		if (step == 'welcome') {
		} else if (step == 'start') {
		} else {
		}
	}

	clairvoyantTurn(step = 'turn') {
		if (step == 'welcome') {
		} else if (step == 'start') {
		} else {
		}
	}

	witchTurn(step = 'turn') {
		if (step == 'welcome') {
		} else if (step == 'start') {
		} else {
		}
	}

	setChannelSendMessagesState(role, state) {
		var channel = this.getChannel('id', this.getChannelConfig('id', role + "-channel").discord_id)
		for (var member of this.getMembers('role', role)) {
			channel.overwritePermissions(this.getGuildMember('id', member.id), {
				SEND_MESSAGES: state,
			})
		}
	}

	disableChannel(role) {
		this.setChannelSendMessagesState(role, true)
	}

	enableChannel(role) {
		this.setChannelSendMessagesState(role, false)
	}

	assignMemberToChannel(member, channel_id) {
		var channel = this.getChannel('id', this.getChannelConfig('id', channel_id).discord_id)
		channel.overwritePermissions(this.getGuildMember('id', member.id), {
			SEND_MESSAGES: false,
			VIEW_CHANNEL: true,
		})
	}

// START

	launchStartTurn() {
		for (var member of this.data.members) {
			this.assignMemberToChannel(member, member.role + "-channel")
			if (member.role != "villager") {
				this.assignMemberToChannel(member, "villager-channel")
			}
		}
		for (var role of c_roles) {
			this[role.id + "Turn"]('welcome')
		}
		for (var role of c_play_order_start) {
			this[role + "Turn"]('start')
		}
	}

	start() {
		var notifs = ""
		this.setRoles()
		for (var member of this.data.members) {
			notifs += "<@" + member.id + "> "
			this.getGuildMember('id', member.id).removeRole(this.config.admin_role)
		}
		this.send(`${notifs}Allez on est tipar ! J'attribue les rôles maintenant, checkez vos DM :3`)
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
			member.role = 'werewolf'
		})
	}


// STOP


	reset() {
		for (var member of this.data.members) {
			this.getGuildMember('id', member.id).addRole(this.config.admin_role)
			for (var channel of this.data.channels.config) {
				if (channel.role_channel) {
					this.getChannel('id', channel.discord_id).overwritePermissions(this.getGuildMember('id', member.id), {
						SEND_MESSAGES: !channel.role_channel,
						VIEW_CHANNEL: !channel.role_channel,
					})
				}
			}
		}
		this.initData()
	}


// REGISTER


	registerMember(member, guild_member) {
		if (this.data.members.find((i) => (i.id == member.id))) {
			this.send(`<@${member.id}> tu croyais m'avoir, on se register pas 2 fois comme ça ici :rage:`)
		} else {
			var nickname = guild_member.nickname ? guild_member.nickname : member.username
			this.data.members.push({id: member.id, nickname: nickname})
			this.send(`**${nickname}** a rejoint la partie, ${["on s'enjaille", "on s'amuse", "vous pouvez quitter du coup"][Utils.rand(2)]}`)
		}
	}


// MESSAGING


	send(txt, channel = null, timeout = 0) {
		if (timeout) {
			var _this = this
			setTimeout(() => ((channel ? channel : _this.data.channels.lobby).send(txt)), timeout)
		} else {
			(channel ? channel : this.data.channels.lobby).send(txt)
		}
	}

	sendDM(txt, id) {
		this.data.guild.members.get(id).send(txt)
	}

// INIT AND MISC


	initData() {
		this.data = {
			status: '',
			members: [],
			commands: [
				{ id: 'init', method: "commandInit", needs_init: false, needs_start: false, authorized_channels: ['lobby'] },
				{ id: 'register', method: "commandRegister", needs_init: true, needs_start: false, authorized_channels: ['lobby'] },
				{ id: 'start', method: "commandStart", needs_init: true, needs_start: false, authorized_channels: ['lobby'] },
				{ id: 'vote', method: "commandVote", needs_init: true, needs_start: true, authorized_channels: ['lobby'] },
				{ id: 'stop', method: "commandStop", needs_init: true, needs_start: false, authorized_channels: ['lobby'] },
				{ id: 'list', method: "commandList", needs_init: true, needs_start: false, authorized_channels: ['lobby'] },
				{ id: 'marry', method: "commandMarry", needs_init: true, needs_start: true, authorized_channels: [] },
				{ id: 'test', method: "commandTest", needs_init: false, needs_start: false, authorized_channels: ['lobby', 'history', 'general'] },
			],
			command: {
				args: null,
				name: null,
			},
			game: {
				current_role: '',
				turn: 0,
			},
			channels: {
				config: [
					{ id: 'lobby', , discord_id: '586174272687308830' },
					{ id: 'history', , discord_id: '586169619564199956' },
					{ id: 'general', , discord_id: '586168794087686145' },
					{ id: 'villager-channel', , discord_id: '586169842135072776', role_channel: true },
					{ id: 'werewolf-channel', , discord_id: '586171506673844234', role_channel: true },
					{ id: 'witch-channel', , discord_id: '586170490180337675', role_channel: true },
					{ id: 'cupidon-channel', , discord_id: '586176105116073994', role_channel: true },
					{ id: 'clairvoyant-channel', , discord_id: '586170550095708171', role_channel: true },
					{ id: 'hunter-channel', , discord_id: '586170721341014056', role_channel: true },
					{ id: 'dead-channel', , discord_id: '586169866294394881', role_channel: true },
				]
			},
			min_players: 1
		}
	}


	getChannelConfig(key, value) {
		return this.data.channels.config.find((chan) => (chan[key] == value))
	}
	getChannel(key, value) {
		return this.data.guild.channels.find((chan) => (chan[key] == value))
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
		return this.data.members.find((i) => (i[key] == value))
	}

	getGuildMember(key, value) {
		return this.data.guild.members.find((i) => (i[key] == value))
	}

	getMembers(key, value) {
		var members = []
		for (var member of this.data.members) {
			if (member[key] == value) {
				members.push(member)
			}
		}
		return members
	}

	getMembersList(array, show_role) {
		var txt = ""
		for (member of array) {
			txt += ` - **${member.nickname}**${member.role == show_role || show_role == 'all' ? `  -- **${_this.getRole(member.role).name}**` : ``}\n`
		}
		return txt
	}
}

module.exports = new LesTerroristesDeThiercelieux({
	triggered_at: "message",
	triggered_when_command: true
})
*/




















/*
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
				this.send(`${this.generateCommand(this.data.command.name)} ça existe pas :rage:`, this.data.init ? this.data.channels : message.channel)
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
		// this.data.start = true
		// this.data.members.push({id: 0, nickname: "a", original_nickname: null, role: 'werewolf'})
		// this.data.members.push({id: 1, nickname: "b", original_nickname: null, role: 'villager'})
		// this.data.members.push({id: 2, nickname: "c", original_nickname: null, role: 'werewolf'})
		// this.data.members.push({id: 3, nickname: "d", original_nickname: null, role: 'witch'})
		// this.data.members.push({id: 4, nickname: "e", original_nickname: null, role: 'hunter'})
		// this.setRoles()
		// return

		this.data.channels = message.guild.channels.find('name', this.config.channel_name)
		this.data.guild = message.guild
		if (this.data.channels.id != message.channel.id) {
			this.send(`Faut le faire dans <#${this.data.channels.id}>, gardons ce serveur calme et serein :3`, message.channel)
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
		if (this.data.start) {
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
			this.data.start = true
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
		// 	// if (!this.data.init || !this.data.start) {
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
			if (_this.data.start && member.role == "werewolf" && see_werewolves) {
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


// TURNS

	werewolfTurn(startup = false) {
		if (step == 'start') {
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
		if (step == 'start') {
			this.data.waiting_command = "marry"
			this.sendDM(`Voici les joueurs:\n${this.getMembersList(this.data.members)}\n\nFais un ${this.generateCommand("marry pseudo_1 pseudo_2")} pour lier 2 personnes entre elles _(c'est rigolo, on s'amuse)_`, cupidon.id)
		} else {
		}
	}

	villagerTurn(startup = false) {
		if (step == 'start') {
		} else {
		}
	}

	hunterTurn(startup = false) {
		if (step == 'start') {
		} else {
		}
	}

	clairvoyantTurn(startup = false) {
		if (step == 'start') {
		} else {
		}
	}

	witchTurn(startup = false) {
		if (step == 'start') {
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
		this.data.start = false
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
		(channel ? channel : this.data.channels).send(txt)
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
			start: false,
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
*/

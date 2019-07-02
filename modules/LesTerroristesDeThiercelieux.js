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
	}

	createCommands() {
		_globals.commands.config = this.config
		_globals.commands.constants = this.constants
		_globals.commands.game = _game
		for (var c of _globals.data.registered_commands) {
			_globals.commands.add(require("./loup_garou/command/" + c + "Command.js"))
		}
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

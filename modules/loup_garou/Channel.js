class Channel {
	constructor(data) {
		for (var i in data) {
			this[i] = data[i]
		}
		this.members = []
	}

	init() {
		this.discord.channel = this.globals.channels.getDiscordChannel('id', this.discord.id)
	}

	send(txt, timeout = 0) {
		this.discord.channel.send(txt, this.discord.channel, timeout)
	}

	assign(member) {
		this.members.push(member)
		this.discord.channel.overwritePermissions(member.discord.guild_member, {
			SEND_MESSAGES: false,
			VIEW_CHANNEL: true,
		})
	}

	unassign(member) {
		this.discord.channel.overwritePermissions(member.discord.guild_member, {
			SEND_MESSAGES: false,
			VIEW_CHANNEL: false,
		})
	}

	setPermissionsState(view, send) {
		var role = this.role
		for (var member of this.globals.members.find((m) => m.role.id == role)) {
			this.discord.channel.overwritePermissions(this.globals.discord.getGuildMember('id', member.discord.id), {
				SEND_MESSAGES: send,
				VIEW_CHANNEL: view
			})
		}
	}

	disable() {
		this.setPermissionsState(true, false)
	}

	enable() {
		this.setPermissionsState(true, true)
	}

	hide() {
		this.setPermissionsState(false, false)
	}

	show() {
		this.setPermissionsState(true, false)
	}

	flush() {
		this.discord.channel.fetchMessages().then(messages => this.discord.channel.bulkDelete(messages));
	}

	sendWelcomeMessage() {
		this.send(this.getWelcomeMessage(), 800)
	}

	getWelcomeMessage() {
		switch (this.role) {
			case 'villager': return `Vous êtes ici dans le fameux village de Hénin-Beaumont, ~~fief du FN~~ heureuse bourgade paisible et prospère !\nAucune attaque de terroristes en vue, vous pouvez dormir sur vos 2 oreilles !`
			case 'cupidon': return `Coucou bébé qui pleure ! Tu vas pouvoir choisir 2 personnes qui vont s'aimer pour toujours :3`
			case 'werewolf': return `Coucou ! Bienvenue sur le channel réversé aux combattants de la liberté :heart:`
			default: return "Coucou"
		}
	}
}

module.exports = Channel;

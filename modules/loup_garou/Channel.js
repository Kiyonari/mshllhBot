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
		var _this = this
		if (timeout > 0) {
			setTimeout(() => (_this.discord.channel.send(txt)), timeout)
		} else {
			this.discord.channel.send(txt)
		}
	}

	assign(member) {
		this.members.push(member)
		this.discord.channel.overwritePermissions(member.discord.guild_member, {
			SEND_MESSAGES: false,
			VIEW_CHANNEL: true,
		})
	}

	unassign(member, view = false) {
		this.removeMember(member)
		this.discord.channel.overwritePermissions(member.discord.guild_member, {
			SEND_MESSAGES: false,
			VIEW_CHANNEL: view,
		})
	}

	setPermissionsState(view, send) {
		for (var member of this.members) {
			if (!member.dead) {
				console.log("setting permissions (" + view + ", " + send + ") for " + member.nickname + " in channel " + this.id)
				this.discord.channel.overwritePermissions(this.globals.discord.getGuildMember('id', member.discord.id), {
					SEND_MESSAGES: send,
					VIEW_CHANNEL: view
				})
			}
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
		if (!this.flushed) {
			this.flushed = true
			this.discord.channel.fetchMessages().then(messages => this.discord.channel.bulkDelete(messages));
		}
	}

	sendWelcomeMessage() {
		this.send(this.getWelcomeMessage(), 200)
	}

	getWelcomeMessage() {
		switch (this.role) {
			case 'villager': return `Vous êtes ici dans le fameux village de Hénin-Beaumont, ~~fief du FN~~ heureuse bourgade paisible et prospère !\nAucune attaque de terroristes en vue, vous pouvez dormir sur vos 2 oreilles !`
			case 'cupidon': return `Coucou bébé qui pleure ! Tu vas pouvoir choisir 2 personnes qui vont s'aimer pour toujours :3`
			case 'werewolf': return `Coucou ! Bienvenue sur le channel réversé aux combattants de la liberté :heart:`
			default: return "Coucou"
		}
	}

	removeMember(member) {
		if (this.members.find((m) => (m.id == member.id))) {
			this.members.splice(this.members.findIndex((i) => (i.discord.id == member.discord.id)), 1)
		}
	}
}

module.exports = Channel;

class Channel {
	constructor(data) {
		for (var i in data) {
			this[i] = data[i]
		}
	}

	init() {
		this.discord.channel = this.globals.channels.getDiscordChannel('id', this.discord.id)
	}

	send(txt, timeout = 0) {
		this.discord.channel.send(txt, this.discord.channel, timeout)
	}

	assign(member) {
		this.discord.channel.overwritePermissions(member.discord.member, {
			SEND_MESSAGES: false,
			VIEW_CHANNEL: true,
		})
	}

	setSendMessagesState(state) {
		for (var member of _members.find((m) => m.hasRole('role'))) {
			this.discord.channel.overwritePermissions(member.discord.member, {
				SEND_MESSAGES: state,
			})
		}
	}

	disable() {
		setSendMessagesState(false)
	}

	enable() {
		setSendMessagesState(true)
	}

	flush() {
		this.discord.channel.fetchMessages().then(messages => this.discord.channel.bulkDelete(messages));
	}
}

module.exports = Channel;

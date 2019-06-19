
class Member {
	constructor() {
		this.nickname = ''
		this.id = ''
		this.roles = []
		this.discord = {
			guild_member: null,
			id: null
		}
	}

	init(data) {
		for (var i in data) {
			this[i] = data[i]
		}
	}

	send(txt, timeout = 0) {
		Log.send(txt, this.discord.guild_member, timeout)
	}

	setRole(role) {
	}
}

module.exports = Member;

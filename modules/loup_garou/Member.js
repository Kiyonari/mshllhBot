
class Member {
	constructor(data) {
		for (var i in data) {
			this[i] = data[i]
		}
	}

	init() {
	}

	send(txt, timeout = 0) {
		Log.send(txt, this.discord.guild_member, timeout)
	}

	setRole(role) {
	}
}

module.exports = Member;

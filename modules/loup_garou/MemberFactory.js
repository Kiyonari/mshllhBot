var Member = require("./Member.js");

class MemberFactory {
	constructor() {
		this.members = []
	}

	create(data) {
		var member = new Member(data)
		member.constants = this.constants
		member.globals = this.globals
		member.game = this.game
		member.init()
		this.members.push(member)
		return member
	}

	findUnique(fn) {
		return this.members.find(fn)
	}

	get(discord_id) {
		return this.members.find((i) => (i.discord.id == discord_id))
	}

	find(fn) {
		var res = []
		for (member of this.members) {
			if (fn(member)) {
				res.push(member)
			}
		}
		return res
	}
}

module.exports = new MemberFactory()

var Member = require("./Member.js");

class MemberFactory {
	constructor() {
		this.members = []
		this.registered_members = []
	}

	create(data) {
		var member = new Member(data)
		member.constants = this.constants
		member.globals = this.globals
		member.game = this.game
		member.init()
		this.registered_members.push(data.discord.id)
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
		for (var member of this.members) {
			if (fn(member)) {
				res.push(member)
			}
		}
		return res
	}

	all(fn = null) {
		if (fn) {
			this.members.forEach(fn)
		}
		return this.members
	}

	reset() {
		this.members = []
		this.registered_members = []
	}

	findByRole(role) {
		return this.find((m) => (m.role.id == role))
	}

	remove(member) {
		this.globals.channels.all(function(c) { if (!c.lobby) { c.removeMember(member) } })
		this.members.splice(this.members.findIndex((i) => (i.id == member.id)), 1)
	}
}

module.exports = new MemberFactory()

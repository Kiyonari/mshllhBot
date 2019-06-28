
class Member {
	constructor(data) {
		for (var i in data) {
			this[i] = data[i]
		}
	}

	init() {
		this.discord.guild_member = this.globals.discord.getGuildMember('id', this.discord.id)
		this.dead = false
	}

	send(txt, timeout = 0) {
		this.globals.log.send(txt, this.discord.guild_member, timeout)
	}

	removeRole(role) {
		this.discord.guild_member.removeRole(this.getRole(role))
	}

	addRole(role) {
		this.discord.guild_member.addRole(this.getRole(role))
	}

	getRole(role) {
		return this.globals.discord[role + "_role"]
	}

	kill() {
		console.log("killing " + this.nickname)
		var _this = this
		this.globals.channels.all(function(c) {
			if (!c.lobby) {
				if (c.id == 'dead-channel') {
					c.assign(_this)
					c.enable()
				} else {
					c.unassign(_this, true)
				}
			}
		})
//		this.discord.guild_member.addRole(this.globals.discord.dead_role)
		this.dead = true
		this.globals.members.remove(_this)
	}

	marryTo(member) {
		this.married = member
	}
}

module.exports = Member;

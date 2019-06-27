
class Member {
	constructor(data) {
		for (var i in data) {
			this[i] = data[i]
		}
	}

	init() {
		this.discord.guild_member = this.globals.discord.getGuildMember('id', this.discord.id)
	}

	send(txt, timeout = 0) {
		Log.send(txt, this.discord.guild_member, timeout)
	}

	removeAdminRole() {
		//this.discord.guild_member.removeRole(this.globals.discord.admin_role)
	}

	addAdminRole() {
		this.discord.guild_member.addRole(this.globals.discord.admin_role)
	}
}

module.exports = Member;

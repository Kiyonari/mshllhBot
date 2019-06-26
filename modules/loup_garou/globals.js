var data = {
	log: require("./Log.js"),
	members: require("./MemberFactory.js"),
	roles: require("./RoleFactory.js"),
	channels: require("./ChannelFactory.js"),
	commands: require("./CommandFactory.js"),
	discord: {
		admin_role: '586169000623341588',
	},

	data: {
		registered_commands: ["Init", "Register", "Start", "Stop", "Marry"],
		registered_roles: ["Werewolf", "Cupidon", "Villager"],
	}
}

data.members.globals = data
data.roles.globals = data
data.channels.globals = data
data.commands.globals = data
data.log.globals = data

data.discord.getGuildMember = (key, value) => ( data.discord.guild.members.find((i) => (i[key] == value)) )

module.exports = data

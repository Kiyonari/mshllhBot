var data = {
	log: require("./Log.js"),
	members: require("./MemberFactory.js"),
	roles: require("./RoleFactory.js"),
	channels: require("./ChannelFactory.js"),
	commands: require("./CommandFactory.js"),
	discord: {
		admin_role: '586169000623341588'
	},

	data: {
		registered_commands: ["Init"],
		registered_roles: ["Werewolf", "Villager"],
	}
}

data.members.globals = data
data.roles.globals = data
data.channels.globals = data
data.commands.globals = data
data.log.globals = data

module.exports = data

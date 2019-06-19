var Role = require("./Role.js")

class RoleFactory {
	constructor() {
		this.roles = []
	}

	create(data) {
		var role = new Role()
		role.init(data)
		this.roles.push(role)
		return role
	}

	add(obj) {
		this.commands.push(obj)
		return obj
	}
}


module.exports = new RoleFactory()

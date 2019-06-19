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

	get(id) {
		return this.find((i) => (this.id == id))
	}

	find(fn) {
		return this.roles.find(fn)
	}

	all() {
		return this.roles
	}
}


module.exports = new RoleFactory()

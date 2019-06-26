var Role = require("./Role.js")

class RoleFactory {
	constructor() {
		this.roles = []
	}

	create(data) {
		var role = new Role(data)
		role.init()
		this.roles.push(role)
		return role
	}

	add(obj) {
		obj.constants = this.constants
		obj.globals = this.globals
		obj.game = this.game
		obj.init()
		this.roles.push(obj)
		return obj
	}

	get(id) {
		return this.find((i) => (i.id == id))
	}

	find(fn) {
		return this.roles.find(fn)
	}

	all(fn = null) {
		if (fn) {
			this.roles.forEach(fn)
		}
		return this.roles
	}

	reset() {
		this.roles = []
	}

}

module.exports = new RoleFactory()

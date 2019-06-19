
class Role {
	constructor() {
		this.id = ''
		this.name = ''
	}

	init(data) {
		for (var i in data) {
			this[i] = data[i]
		}
	}
}

module.exports = Role;

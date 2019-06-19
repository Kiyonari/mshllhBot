
class Role {
	constructor(data) {
		for (var i in data) {
			this[i] = data[i]
		}
	}

	init() {
	}
}

module.exports = Role;

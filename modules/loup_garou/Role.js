class Role {
	constructor(data) {
		for (var i in data) {
			this[i] = data[i]
		}
	}

	init() {
		this.discord = {
			channel: this.globals.channels.get(this.id + "-channel")
		}
	}
}

module.exports = Role;

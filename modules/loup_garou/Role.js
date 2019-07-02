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

	initSpecialized() {
	}

	playKillTurn() {
	}
}

module.exports = Role;

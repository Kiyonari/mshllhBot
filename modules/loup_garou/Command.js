
class Command {
	constructor(data) {
		for (var i in data) {
			this[i] = data[i]
		}
	}

	init() {
	}

	canExec(message, args) {
		return true
	}

	exec(args) {
	}
}

module.exports = Command;

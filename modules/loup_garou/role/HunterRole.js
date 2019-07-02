
var Role = require("../Role.js")

class HunterRole extends Role {
	playStartTurn() {
	}

	playDefaultTurn() {
	}

	playKillTurn() {
	}
}

module.exports = new HunterRole({
	'hunter',
	name: "Cancer",
	fixed_number: 1,
	ratio: 0.1,
})

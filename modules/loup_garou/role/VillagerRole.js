var Role = require("../Role.js")

class VillagerRole extends Role {
	playStartTurn() {
	}

	playDefaultTurn() {
	}
}

module.exports = new VillagerRole({
	id: 'villager',
	name: "Péon",
	ratio: 1,
})

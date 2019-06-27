var Role = require("../Role.js")

class VillagerRole extends Role {
	playStartTurn() {
		this.globals.channels.get('lobby').send("villager start turn")
		this.game.nextTurn()
	}

	playDefaultTurn() {
		this.globals.channels.get('lobby').send("villager default turn")
		this.game.nextTurn()
	}
}

module.exports = new VillagerRole({
	id: 'villager',
	name: "Péon",
	ratio: 1,
})

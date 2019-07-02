var Role = require("../Role.js")

class CupidonRole extends Role {
	playStartTurn() {
		this.discord.channel.send(`Coucou <@${this.globals.members.findByRole('cupidon')[0].id}> ! Tu vas pouvoir choisir 2 personnes qui vont s'aimer pour toujours :3`, 200)
		this.game.waiting_command = "marry"
		this.discord.channel.enable()
	}

	playDefaultTurn() {
	}
}

module.exports = new CupidonRole({
	id: 'cupidon',
	name: "Bébé avec un arc qui vole",
	ratio: 0.1,
	fixed_number: 1,
})

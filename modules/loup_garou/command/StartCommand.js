var Command = require("../Command.js")
const Utils = require("../../../Utils.js")

class Start extends Command {
	canExec(message, args) {
		if (this.game.status == 'init') {
			return true
		}
		this.globals.log.send(`Il faudrait d'abord initialiser le jeu avant de le lancer <@${message.author.id}> :thinking:`)
		return false
	}

	exec(message, args) {
		this.globals.log.send(`C'est tipar !`)
		this.game.status = 'start'

		this.setRoles()
		this.startGame()
	}

	setRoles() {
		var conf = []
		for (var registered of this.globals.roles.all()) {
			var role = {id: registered.id, mandatory: registered.mandatory ? true : false, optional: !registered.mandatory}
			if (registered.fixed_number) {
				role.ratio = registered.fixed_number
			} else {
				role.ratio = Math.floor(registered.ratio * this.globals.members.all().length)
				if (role.ratio <= 0) {
					role.ratio = 1
				}
			}
			if (!role.mandatory && Utils.rand() % 3 == 0) {
				role.optional = true
			}
			if (role.mandatory || Utils.rand() % 4) {
				conf.push(role)
			}
		}
		conf.sort(function(a, b) {
			if ((a.ratio > b.ratio && !b.mandatory) || a.mandatory) {
				return -1;
			} else if (a.ratio == b.ratio) {
				return a.mandatory ? -1 : (b.mandatory ? 1 : 0)
			} else {
				return 1
			}
		})

		var shuffled = this.shuffle(this.globals.members.all())
		var current_role_id = 0
		var current_role = conf[current_role_id]
		shuffled.forEach(function(member) {
			if (current_role.ratio > 0) {
				member.role = current_role.id
				current_role.ratio--;
				if (current_role.ratio == 0) {
					current_role_id++;
					current_role = current_role_id == conf.length ? 'villager' : conf[current_role_id]
				}
			}
		})
		for (var member of this.globals.members.all()) {
			member.role = this.globals.roles.get(shuffled.find((i) => member.id == i.id).role)
		}
	}

	startGame() {
	}

	shuffle(array) {
    let counter = array.length;
    while (counter > 0) {
        let index = Utils.rand(counter - 1);
        counter--;
        let temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }
    return array;
	}
}

module.exports = new Start({
	id: 'start',
	required_status: 'start',
	authorized_channels: ['lobby']
})

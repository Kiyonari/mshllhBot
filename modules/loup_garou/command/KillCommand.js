var Command = require("../Command.js")

class KillCommand extends Command {
	canExec(message, args) {
		if (this.game.waiting_command != 'kill') {
			message.channel.send(`Un peu trop tôt pour voter <@${message.author.id}> ;)`)
			return false
		} else if (args.length != 1) {
			message.channel.send(`Une personne, ni plus ni moins <@${message.author.id}> :rage:`)
			return false
		} else if (this.globals.members.get(message.author.id).role.id != 'werewolf') {
			message.channel.send(`Il faut être un terroriste pour faire ça <@${message.author.id}> :rage:`)
			return false
		} else {
			return true
		}
	}

	exec(message, args) {
		var killed = this.globals.members.findUnique((m) => (m.nickname == args[0]))
		var werewolf = this.globals.members.get(message.author.id)
		var channel = this.globals.channels.get('werewolf-channel')

		if (!this.votes) {
			this.votes = {}
			for (var member of this.globals.members.findByRole('werewolf')) {
				this.votes[member.id] = null
			}
		}
		if (!killed) {
			channel.send(`**${args[0]}** n'existe pas :rage:`)
			return
		}
		this.votes[werewolf.id] = killed.id
		if (this.hasRemainingVotes()) {
			channel.send(`${this.getObjectLength(this.getVotes())} terroristes ont voté ! Voici ceux qui doivent encore voter: **${this.getRemainingVotes(true, true).join(', ')}**\n\nVoici donc les résultats pour l'instant:\n${this.getVoteResults()}`)
		} else {
			var final_killed = this.getMostVotedMember()
			channel.send(`Tout le monde a voté !\n\nEh bien c'est **${final_killed.nickname}** qui a été désigné pour sauter ~~pour la gloire d'Allah~~ pour la justice !`)
			this.game.turn.werewolf_data.dead = final_killed
			this.game.waiting_command = null
			this.votes = null
			channel.disable()
			this.game.nextTurn()
		}
	}

	getMostVotedMember() {
		var sorted = {}
		for (var i in this.votes) {
			if (!sorted[this.votes[i]]) {
				sorted[this.votes[i]] = 0
			}
			sorted[this.votes[i]]++
		}
		var max_votes = 0
		var found = ''
		for (var i in sorted) {
			if (sorted[i] > max_votes) {
				found = i
				max_votes = sorted[i]
			}
		}
		return this.globals.members.get(found)
	}

	getVotes() {
		var votes = {}
		for (var id in this.votes) {
			if (this.votes[id]) {
				votes[id] = this.votes[id]
			}
		}
		return votes
	}

	getRemainingVotes(use_nickname = false, mention = false) {
		var votes = []
		for (var id in this.votes) {
			if (!this.votes[id]) {
				votes.push(mention ? `<@${id}>` : (use_nickname ? this.globals.members.get(id).nickname : id))
			}
		}
		return votes
	}

	getVoteResults() {
		var results = this.getVotes()
		var txt = ""
		for (var id in results) {
			txt += `**${this.globals.members.get(id).nickname}**: ${this.getVotesNumberById(results[id])} votes\n`
		}
		return txt
	}

	getVotesNumberById(id) {
		var r = 0
		for (var werewolf in this.votes) {
			if (this.votes[werewolf] == id) {
				r++
			}
		}
		return r
	}

	hasRemainingVotes() {
		return this.getObjectLength(this.getRemainingVotes()) != 0
	}

	getObjectLength(obj) {
		var l = 0
		for (var o in obj) {
			l++
		}
		return l
	}
}

module.exports = new KillCommand({
	id: 'kill',
	authorized_channels: ['werewolf-channel']
})

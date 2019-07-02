var Command = require("../Command.js")

class VoteCommand extends Command {
	canExec(message, args) {
		console.log(this.game.waiting_command)
		if (this.game.waiting_command != 'vote') {
			message.channel.send(`Un peu trop tôt pour voter <@${message.author.id}> ;)`)
			return false
		} else if (args.length != 1) {
			message.channel.send(`Une personne, ni plus ni moins <@${message.author.id}> :rage:`)
			return false
		} else {
			return true
		}
	}

	exec(message, args) {
		var voted = this.globals.members.findUnique((m) => (m.nickname == args[0]))
		var channel = this.globals.channels.get('villager-channel')
		var villager = this.globals.members.get(message.author.id)

		if (!this.votes) {
			this.votes = {}
			this.votes_number = 0
			for (var member of this.globals.members.all()) {
				this.votes[member.id] = null
			}
		}
		if (!voted) {
			channel.send(`**${args[0]}** n'existe pas :rage:`)
		} else {
			if (!this.votes[villager.id]) {
				this.votes_number++
			}
			this.votes[villager.id] = voted.id
			if (this.hasRemainingVotes()) {
				channel.send(`${this.votes_number} villageois ${this.votes_number > 1 ? 'ont' : 'a'} voté ! Voici ceux qui doivent encore voter: **${this.getRemainingVotes().join(', ')}**\n\nVoici donc les résultats pour l'instant:\n${this.getVoteResults()}`)
			} else {
				var final_voted = this.getMostVotedMember()
				channel.send(`Tout le monde a voté !`)
				this.game.turn.villager_data.dead = final_voted
				this.votes = null
				channel.disable()
				this.game.nextTurn()
			}
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

	getRemainingVotes() {
		var votes = []
		for (var id in this.votes) {
			if (!this.votes[id]) {
				votes.push(`<@${id}>`)
			}
		}
		return votes
	}

	getVoteResults() {
		var results = this.getVotes()
		var txt = ""
		for (var id in results) {
			var n = this.getVotesNumberById(results[id])
			txt += `**${this.globals.members.get(results[id]).nickname}**: ${n} vote${n > 1 ? 's' : ''}\n`
		}
		return txt
	}

	getVotesNumberById(id) {
		var r = 0
		for (var villager in this.votes) {
			if (this.votes[villager] == id) {
				r++
			}
		}
		return r
	}

	hasRemainingVotes() {
		return this.votes_number != this.globals.members.all().length
	}

	getObjectLength(obj) {
		var l = 0
		for (var o in obj) {
			l++
		}
		return l
	}
}

module.exports = new VoteCommand({
	id: 'vote',
	authorized_channels: ['villager-channel']
})

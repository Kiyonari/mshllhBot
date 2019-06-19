var Member = require("./Member.js");

class MemberFactory {
	constructor() {
		this.members = []
	}

	create(data) {
		var member = new Member()
		member.constants = this.constants
		member.globals = this.globals
		member.game = this.game
		member.init(data)
		this.members.push(member)
		return member
	}

	findUnique(fn) {
		return this.members.find(fn)
	}

	find(fn) {
		var res = []
		for (member of this.members) {
			if (fn(member)) {
				res.push(member)
			}
		}
		return res
	}
}

module.exports = new MemberFactory()

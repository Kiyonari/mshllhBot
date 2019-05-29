const BaseModule = require("./BaseModule.js")
const Utils = require("../Utils")

class RandomInteractions extends BaseModule {
	process(message) {
    const repeatRandom = Utils.rand(300);
    if (repeatRandom <= 2) {
      message.channel.send(Utils.spongeBob(message.content));
    } else if (repeatRandom >= 299) {
      this.fdpFunction(message);
    } else if ((repeatRandom === 69 || repeatRandom === 42)) {
      this.everyoneFunction(message);
    } else if ((repeatRandom === 100 || repeatRandom === 200)) {
      this.reactFunction(message)
    }
  }

	everyoneFunction(message) {
		const everyoneId = message.guild.roles.find('name', 'everyouane').id;
		message.channel.send("<@&" + everyoneId + "> :point_up: :ok_hand:");
	}

	reactFunction(message) {
		message.react("👌");
	}

	fdpFunction(message) {
		message.channel.send(message.content + " fdp", {
			tts: true
		});
	}
}

module.exports = new RandomInteractions({
	triggered_at: "message",
	triggered_when_command: false
})

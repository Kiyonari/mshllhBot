const BaseModule = require("./BaseModule.js")
const Utils = require("../Utils")

class GayCommand extends BaseModule {
  canProcess(message) {
		return message.content.startsWith(this.constants.command_prefix + "gay")
  }

	process(message) {
		var gays = message.content.split(' ');
		if (gays.length !== 3) {
		    return;
		}
		const pourcentagePd = Utils.rand();
		var emojiPd = "";
		if (pourcentagePd < 30) {
		    emojiPd = ":skull:";
		} else if (pourcentagePd > 70) {
		    emojiPd = ":gay_pride_flag:";
		} else if (pourcentagePd === 69) {
		    emojiPd = client.emojis.find("name", "aerW");
		} else if (pourcentagePd === 100) {
		    emojiPd = ":gay_pride_flag: :gay_pride_flag: :gay_pride_flag:";
		} else if (pourcentagePd === 0) {
		    emojiPd = ":skull: :skull: :skull:";
		}
		message.channel.send(gays[1] + " et " + gays[2]+ " sont " + pourcentagePd + "% pd " + emojiPd);
  }
}

module.exports = new GayCommand({
	triggered_at: "message",
	stop_propagation: true,
	triggered_when_command: true
})

const BaseModule = require("./BaseModule.js")
const gag = require("../9gag.js");

class MashallahImageSender extends BaseModule {
	process(message) {
		gag.replace9GagVideo(message);
  }
}

module.exports = new MashallahImageSender({
	triggered_at: "message",
	triggered_when_command: false
})

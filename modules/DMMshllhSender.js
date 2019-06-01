const BaseModule = require("./BaseModule.js")
const Utils = require("../Utils")
const Logger = require("@elian-wonhalf/pretty-logger")

class DMMshllhSender extends BaseModule {
    canProcess(message) {
        return Utils.rand(150) == 42
    }
    process(message) {
        message.author.send({ file: this.constants.mashallah_image }).catch(Logger.exception);
    }
}

module.exports = new DMMshllhSender({
	triggered_at: "message",
	triggered_when_command: false
})

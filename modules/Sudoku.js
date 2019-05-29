const BaseModule = require("./BaseModule.js")
const Utils = require("../Utils.js")

class Sudoku extends BaseModule {
    canProcess(message) {
        return message.content == "/mines";
    }

    process(message) {
    	var size = 6
    	var txt = ""

    	for (var y = 0; y < size; y++) {
    		for (var x = 0; x < size; x++) {
	    		txt += "||:" + ["zero", "one", "two", "three", "four", "eight", "bomb"][Utils.rand(6)] + ":|| "
    		}
    		txt += "\n"
    	}
    	message.channel.send(txt)
  }
}

module.exports = new Sudoku({
    triggered_at: "message",
    triggered_when_command: false
})

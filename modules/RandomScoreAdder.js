const BaseModule = require("./BaseModule.js")
const fs = require("fs");
const ScoreHandler = require('./ScoreHandler.js');

class RandomScoreAdder extends BaseModule {
    process(message) {
        ScoreHandler.addScore(message, 1, "Le bot a vu le messie en toi.");
    }
}

module.exports = new RandomScoreAdder({
    triggered_at: "message",
    trigger_probability: 1,
    triggered_when_command: false
})

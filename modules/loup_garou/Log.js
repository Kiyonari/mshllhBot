
class Log {
	static send(txt, channel = null, timeout = 0) {
		if (!channel) {
			channel = this.globals.channels.get('lobby')
		}
		if (timeout) {
			setTimeout(() => channel.send(txt), timeout)
		} else {
			channel.send(txt)
		}
	}
}

module.exports = Log

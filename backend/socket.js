const { Crypto } = require('../src/utils/crypto')
const { User } = require('./db/models/user.js')

let crypto = new Crypto()

class Socket {
	/** @type {Socket}*/
	socket = null
	userData = null

	constructor(socket, userData) {
		this.socket = socket
		this.userData = userData
	}

	on(key, cb) {
		this.socket.on(key, async (data) => {
			crypto.setKey(this.userData?.key)
			let m = crypto.dec(data)

			if (m.userId) m._user = await User.findOne({ where: { id: m.userId } })

			cb(m)
		})
	}

	emit(key, data) {
		crypto.setKey(this.userData?.key)
		this.socket.emit(key, crypto.enc(data))
	}
}

module.exports = { Socket }

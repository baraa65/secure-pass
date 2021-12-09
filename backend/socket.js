const { Crypto } = require('../src/utils/crypto')
const { RSA } = require('./crypto/rsa')
const { User } = require('./db/models/user.js')

Crypto.init(RSA)

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
			Crypto.setKey(this.userData?.key)
			let m = Crypto.dec(data)

			if (m.userId) m._user = await User.findOne({ where: { id: m.userId } })

			cb(m)
		})
	}

	emit(key, data) {
		Crypto.setKey(this.userData?.key)
		this.socket.emit(key, Crypto.enc(data))
	}
}

module.exports = { Socket }

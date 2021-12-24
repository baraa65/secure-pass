const { Crypto } = require('../src/utils/crypto')
const { User } = require('./db/models/user.js')

let crypto = new Crypto()

class Socket {
	/** @type {Socket}*/
	socket = null
	userData = null
	serverRSA = null

	constructor(socket, userData, serverRSA) {
		this.socket = socket
		this.userData = userData
		this.serverRSA = serverRSA
	}

	on(key, cb) {
		this.socket.on(key, async (data) => {
			crypto.setKey(this.userData?.key)
			let m = crypto.dec(data)

			if (m.userId) {
				m._user = await User.findOne({ where: { id: m.userId } })
				this.serverRSA.setSigningPublicKey(m._user?.signingPublicKey)
				let valid = await this.serverRSA.verify(m.userId, m.signature)

				if (!valid) return console.error('Invalid Signature!!!')
			}

			cb(m)
		})
	}

	emit(key, data) {
		crypto.setKey(this.userData?.key)
		this.socket.emit(key, crypto.enc(data))
	}
}

module.exports = { Socket }

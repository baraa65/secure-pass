import io, { Socket } from 'socket.io-client'
import { boot } from 'quasar/wrappers'
import Store from 'src/store'
const { generateString } = require('../utils/random-string')
import { $notify } from '../utils/notify'
const store = Store()
const { Crypto } = require('src/utils/crypto')
const { RSA } = require('src/utils/rsa')
let socket = io('localhost:3000', { transports: ['websocket'] })

Crypto.init(RSA)
let crypto = new Crypto()

class SocketClass {
	/** @type {Socket}*/
	socket = null

	constructor(socket) {
		this.socket = socket
	}

	emit(key, data = {}) {
		let user = store.getters['User/user']

		if (!data.userId) data.userId = user?.id

		crypto.keyLoaded(() => {
			this.socket.emit(key, crypto.enc(data))
		})
	}

	on(key, cb) {
		this.socket.on(key, (data) => {
			let m = crypto.dec(data)

			cb(m)
		})
	}
}

socket.emit('get-public-key')

socket.on('get-public-key', (data) => {
	Crypto.RSA.setPublicKey(data?.data?.key)

	let key = generateString(10)

	crypto.setKey(key)

	socket.emit('session-key', Crypto.RSA.enc({ key }))
})

socket.on('session-key', (data) => {
	$notify(data)
})

export default boot(async ({ app }) => {
	app.config.globalProperties.$socket = socket
	app.config.globalProperties.$Socket = new SocketClass(socket)
})

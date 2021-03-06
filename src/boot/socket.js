import io, { Socket } from 'socket.io-client'
import { boot } from 'quasar/wrappers'
import Store from 'src/store'
const { generateString } = require('../utils/random-string')
import { $notify } from '../utils/notify'
import { clientRSA } from '../utils/client-rsa'
import { KeyPairStorage } from '../storage/private-key'
import { certVerifier } from '../utils/ca'
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

	async emit(key, data = {}) {
		let user = store.getters['User/user']

		if (!data.userId && Object.keys(user).length) {
			data.userId = user.id
			getUserKeys()
			data.signature = await clientRSA.sign(user.id)
		}

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
socket.emit('get-cert')

socket.on('get-cert', async (data) => {
	let cert = { CN: data.data.cert.CN, publicKey: data.data.cert.publicKey }

	if (cert.CN != 'secure-pass.com') throw 'Invalid CN'
	if (!(await certVerifier.verify(cert, data.data.cert.signature))) throw 'Invalid Signature'

	Crypto.RSA.setPublicKey(cert.publicKey)

	let key = generateString(10)

	crypto.setKey(key)

	socket.emit('session-key', Crypto.RSA.enc({ key }))
})

socket.on('session-key', (data) => {
	$notify(data)
})

function getUserKeys() {
	let user = store.getters['User/user']
	if (!user) return
	let keys = KeyPairStorage.get(user.username)
	if (!keys) return

	clientRSA.setKeys(keys)
}

export default boot(async ({ app }) => {
	app.config.globalProperties.$socket = socket
	app.config.globalProperties.$Socket = new SocketClass(socket)
	getUserKeys()
})

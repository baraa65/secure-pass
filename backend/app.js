require('./db')
const Sequelize = require('sequelize')
const { Server } = require('socket.io')
const { User } = require('./db/models/user')
const { Password } = require('./db/models/password')
const { SharedPassword } = require('./db/models/shared-password')
const {
	validateUserRegister,
	validateUserLogin,
	getPasswordValidation,
	createPasswordValidation,
	updatePasswordValidation,
	deletePasswordValidation,
} = require('./validations')
const { Socket: SocketClass } = require('./socket')
const { Crypto } = require('./crypto/index')
const { UserData } = require('./user-data')
const { ServerRsa } = require('./crypto/server-rsa')
const axios = require('axios')
let CA = axios.create({ baseURL: 'http://127.0.0.1:3001/' })
let passwordCrypto = new Crypto()

const io = new Server()

CA.post('/cert', { publicKey: Crypto.RSA.publicKey, CN: 'secure-pass.com' }).then(({ data }) => {
	let cert = data.cert
	console.error('certificate fetched')
	io.on('connection', (socket) => {
		console.error('connect')
		let userData = new UserData()
		const serverRSA = new ServerRsa()
		const Socket = new SocketClass(socket, userData, serverRSA)

		socket.on('get-cert', () => {
			socket.emit('get-cert', { status: 200, data: { cert } })
		})

		socket.on('get-public-key', () => {
			socket.emit('get-public-key', { status: 200, data: { key: Crypto.RSA.publicKey } })
		})

		socket.on('session-key', (data) => {
			data = Crypto.RSA.dec(data)

			userData.setKey(data?.key)

			socket.emit('session-key', { status: 200, msg: 'Session Key has been received' })
		})

		Socket.on('register', async (data) => {
			let res = await validateUserRegister(data.user)
			if (res) return socket.emit('register', res)

			let password = passwordCrypto.hash(data.user.password)
			let user = await User.create({ ...data.user, password })

			Socket.emit('register', { status: 200, msg: 'Register Completed Successfully', data: user })
		})

		Socket.on('login', async (data) => {
			let res = await validateUserLogin(data.user)
			if (res) return Socket.emit('login', res)

			let password = passwordCrypto.hash(data.user?.password)
			let user = await User.findOne({ where: { username: data.user?.username, password } })

			if (!user) {
				return Socket.emit('login', { status: 401, msg: 'Login Failed, invalid username or password' })
			}

			Socket.emit('login', { status: 200, msg: 'Login Completed Successfully', data: user })
		})

		Socket.on('users', async (data) => {
			let users = await User.findAll({ where: { id: { [Sequelize.Op.not]: data._user?.id } } })

			Socket.emit('users', { status: 200, data: users })
		})

		Socket.on('passwords', async (data) => {
			let passwords = await Password.findAll({ where: { userId: data._user?.id || null } })

			Socket.emit('passwords', { status: 200, data: passwords })
		})

		Socket.on('get-password', async (data) => {
			let res = await getPasswordValidation(data.id)
			if (res) return Socket.emit('get-password', res)

			let password = await Password.findOne({ where: { id: data.id, userId: data._user?.id } })

			Socket.emit('get-password', { status: 200, data: password })
		})

		Socket.on('add-password', async (data) => {
			let res = await createPasswordValidation(data.password)
			if (res) return Socket.emit('add-password', res)

			let password = await Password.create(data.password)

			Socket.emit('add-password', { status: 200, msg: 'Password Has Been Created', data: password })
		})

		Socket.on('edit-password', async (data) => {
			let res = await updatePasswordValidation(data)
			if (res) return Socket.emit('edit-password', res)

			await Password.update({ ...data.password }, { where: { id: data.id } })
			let password = await Password.findOne({ where: { id: data.id } })

			Socket.emit('edit-password', { status: 200, msg: 'Password Has Been Updated', data: password })
		})

		Socket.on('delete-password', async (data) => {
			let res = await deletePasswordValidation(data.id)
			if (res) return Socket.emit('delete-password', res)

			await Password.destroy({ where: { id: data.id } })

			Socket.emit('delete-password', { status: 200, msg: 'Password Has Been Deleted', data })
		})

		Socket.on('share-password', async (data) => {
			let shareRequest = await SharedPassword.create(data.sharedPassword)
			Socket.emit('share-password', { status: 200, msg: 'Password Has Been Shared', data: shareRequest })
		})

		Socket.on('shared-passwords', async (data) => {
			let shareRequests = await SharedPassword.findAll({ where: { receiverId: data.userId } })

			Socket.emit('shared-passwords', { status: 200, data: shareRequests })
		})

		Socket.on('accept-shared-password', async (data) => {
			let password = data.password
			let sharedPasswordId = data.sharedPasswordId

			await Password.create({ password, userId: data._user.id })
			await SharedPassword.destroy({ where: { id: sharedPasswordId } })

			Socket.emit('accept-shared-password', { status: 200, msg: 'Password Has Been Accepted' })
		})

		Socket.on('reject-shared-password', async (data) => {
			await SharedPassword.destroy({ where: { id: data.sharedPasswordId } })

			Socket.emit('reject-shared-password', { status: 200, msg: 'Password Has Been Rejected' })
		})
	})
})

io.listen(3000)

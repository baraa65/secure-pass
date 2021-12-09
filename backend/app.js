require('./db')
const { Server } = require('socket.io')
const { User } = require('./db/models/user')
const { Password } = require('./db/models/password')
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

const io = new Server()

io.on('connection', (socket) => {
	console.error('connect')
	let userData = new UserData()
	const Socket = new SocketClass(socket, userData)

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

		let user = await User.create(data.user)

		Socket.emit('register', { status: 200, msg: 'Register Compoleted Successfully', data: user })
	})

	Socket.on('login', async (data) => {
		let res = await validateUserLogin(data.user)
		if (res) return Socket.emit('login', res)

		let user = await User.findOne({ where: { username: data.user?.username, password: data.user?.password } })

		if (!user) {
			return Socket.emit('login', { status: 401, msg: 'Login Failed, invalid username or password' })
		}
		Socket.emit('login', { status: 200, msg: 'Login Completed Successfully', data: user })
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
})

io.listen(3000)

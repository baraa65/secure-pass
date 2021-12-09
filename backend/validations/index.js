const { User } = require('../db/models/user')
const { Password } = require('../db/models/password')

async function validateUserRegister(user) {
	if (!user.username) return { status: 418, msg: 'Username is required' }
	if (!user.password) return { status: 418, msg: 'Password is required' }

	let foundUser = await User.findOne({ where: { username: user.username } })

	if (foundUser) return { status: 418, msg: 'Username already exist' }

	return null
}

async function validateUserLogin(user) {
	if (!user.username) return { status: 418, msg: 'Username is required' }
	if (!user.password) return { status: 418, msg: 'Password is required' }

	return null
}

async function getPasswordValidation(id) {
	if (!id) return { status: 418, msg: 'id is required' }

	let foundPassword = await Password.findOne({ where: { id } })
	if (!foundPassword) return { status: 404, msg: 'Password not found' }

	return null
}

async function createPasswordValidation(password) {
	if (!password.password) return { status: 418, msg: 'Password is required' }

	return null
}

async function updatePasswordValidation({ id, _user }) {
	if (!id) return { status: 418, msg: 'id is required' }

	let foundPassword = await Password.findOne({ where: { id } })
	if (!foundPassword) return { status: 404, msg: 'Password not found' }

	if (foundPassword.userId != _user?.id) return { status: 403, msg: 'Unauthorized (mismatch userId)' }

	return null
}

async function deletePasswordValidation(id) {
	if (!id) return { status: 418, msg: 'id is required' }

	let foundPassword = await Password.findOne({ where: { id } })
	if (!foundPassword) return { status: 404, msg: 'Password not found' }

	return null
}

module.exports = {
	validateUserLogin,
	validateUserRegister,
	getPasswordValidation,
	updatePasswordValidation,
	createPasswordValidation,
	deletePasswordValidation,
}

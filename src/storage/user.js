export class UserStorage {
	static key = 'user'

	static get() {
		let user = localStorage.getItem(this.key)

		if (user) {
			try {
				return JSON.parse(user)
			} catch (e) {
				console.error(e.message)
			}
		}

		return null
	}

	static set(user) {
		localStorage.setItem(this.key, JSON.stringify(user))
	}

	static clear() {
		localStorage.setItem(this.key, '')
	}
}

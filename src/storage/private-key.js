export class KeyPairStorage {
	static key = 'keypair'

	static getKey(username) {
		return `${this.key}-${username}`
	}

	static get(username) {
		let keyPair = localStorage.getItem(this.getKey(username))

		if (keyPair) {
			try {
				return JSON.parse(keyPair)
			} catch (e) {
				console.error(e.message)
			}
		}

		return null
	}

	static set(username, keyPair) {
		localStorage.setItem(this.getKey(username), JSON.stringify(keyPair))
	}

	static clear(username) {
		localStorage.setItem(this.getKey(username), '')
	}
}

const { KeysGenerator } = require('./keys-generator')
const { subtle } = require('crypto').webcrypto

class ServerRsa {
	publicKey = ''
	privateKey = ''
	signingPrivateKey = ''
	signingPublicKey = ''
	encoder = new TextEncoder()
	decoder = new TextDecoder()

	async generateKeys() {
		let keyPair = await KeysGenerator.generateKeys()
		let signingKeyPair = await KeysGenerator.generateSigningKeys()

		this.publicKey = keyPair.publicKey
		this.privateKey = keyPair.privateKey
		this.signingPrivateKey = signingKeyPair.privateKey
		this.signingPublicKey = signingKeyPair.publicKey

		return { encryption: keyPair, signing: signingKeyPair }
	}

	setKeys(keys) {
		this.publicKey = keys.encryption.publicKey
		this.privateKey = keys.encryption.privateKey
		this.signingPrivateKey = keys.signing.privateKey
		this.signingPublicKey = keys.signing.publicKey
	}

	setPublicKey(key) {
		this.publicKey = key
	}
	setPrivateKey(key) {
		this.privateKey = key
	}

	async enc(m) {
		let publicKey = await KeysGenerator.importKey(this.publicKey, 'public')

		let encoded = this.encoder.encode(JSON.stringify(m))
		let ciphertext = await subtle.encrypt({ name: 'RSA-OAEP' }, publicKey, encoded)

		return KeysGenerator.ABtoB64(ciphertext)
	}

	async dec(enc) {
		let privateKey = await KeysGenerator.importKey(this.privateKey, 'private')

		let decrypted = await subtle.decrypt({ name: 'RSA-OAEP' }, privateKey, KeysGenerator.B64toAB(enc))
		let mStr = this.decoder.decode(decrypted)

		return mStr ? JSON.parse(mStr) : undefined
	}

	async sign(data) {
		let privateKey = await KeysGenerator.importSigningKey(this.signingPrivateKey, 'private')

		let signature = await subtle.sign(
			{ name: 'RSA-PSS', saltLength: 32 },
			privateKey,
			KeysGenerator.B64toAB(btoa(data)),
		)

		return signature
	}

	async verify(data, signature) {
		let publicKey = await KeysGenerator.importSigningKey(this.signingPublicKey, 'public')

		let result = await subtle.verify(
			{ name: 'RSA-PSS', saltLength: 32 },
			publicKey,
			signature,
			KeysGenerator.B64toAB(btoa(data)),
		)

		return result
	}
}

module.exports = {
	serverRSA: new ServerRsa(),
	ServerRsa,
}

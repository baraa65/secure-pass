const crypto = require('crypto')

class RSA {
	publicKey = ''
	privateKey = ''
	options = {
		// padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
		padding: crypto.constants.RSA_PKCS1_PADDING,
		// oaepHash: 'sha256',
		passphrase: '1234',
	}

	setPublicKey(key) {
		this.publicKey = key
	}
	setPrivateKey(key) {
		this.privateKey = key
	}

	enc(m) {
		const encryptedData = crypto.publicEncrypt({ key: this.publicKey, ...this.options }, JSON.stringify(m))

		return encryptedData.toString('base64')
	}

	dec(enc) {
		const decryptedData = crypto.privateDecrypt({ key: this.privateKey, ...this.options }, Buffer.from(enc, 'base64'))

		let mStr = decryptedData.toString('utf8')

		return mStr ? JSON.parse(mStr) : undefined
	}
}

module.exports = { RSA }

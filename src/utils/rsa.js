const JSEncrypt = require('jsencrypt')

export class RSA {
	publicKey = ''
	privateKey = ''

	setPublicKey(key) {
		this.publicKey = key
	}
	setPrivateKey(key) {
		this.privateKey = key
	}

	enc(m) {
		const encrypt = new JSEncrypt.JSEncrypt()
		encrypt.setPublicKey(this.publicKey)
		return encrypt.encrypt(JSON.stringify(m))
	}

	dec(enc) {
		return enc
	}
}

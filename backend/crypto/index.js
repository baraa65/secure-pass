const { generateKeyPairSync } = require('crypto')
const { Crypto } = require('../../src/utils/crypto')
const { RSA } = require('./rsa')

Crypto.init(RSA)

let { publicKey, privateKey } = generateKeyPairSync('rsa', {
	modulusLength: 4096,
	publicKeyEncoding: {
		type: 'spki',
		format: 'pem',
	},
	privateKeyEncoding: {
		type: 'pkcs8',
		format: 'pem',
		cipher: 'aes-256-cbc',
		passphrase: '1234',
	},
})

Crypto.RSA.setPublicKey(publicKey)
Crypto.RSA.setPrivateKey(privateKey)


module.exports = { Crypto }

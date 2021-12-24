const { subtle } = require('crypto').webcrypto

function b64EncodeUnicode(str) {
	return btoa(
		encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function (match, p1) {
			return String.fromCharCode('0x' + p1)
		}),
	)
}

function b64DecodeUnicode(str) {
	return decodeURIComponent(
		Array.prototype.map
			.call(atob(str), function (c) {
				return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
			})
			.join(''),
	)
}

function stringToArrayBuffer(byteString) {
	let byteArray = new Uint8Array(byteString.length)
	for (let i = 0; i < byteString.length; i++) {
		byteArray[i] = byteString.codePointAt(i)
	}
	return byteArray
}

function arrayBufferToString(exportedPrivateKey) {
	let byteArray = new Uint8Array(exportedPrivateKey)
	let byteString = ''
	for (let i = 0; i < byteArray.byteLength; i++) {
		byteString += String.fromCodePoint(byteArray[i])
	}
	return byteString
}

class KeysGenerator {
	static ABtoB64(ab) {
		let DER = arrayBufferToString(ab)
		let B64 = b64EncodeUnicode(DER)

		return B64
	}
	static B64toAB(b64) {
		let DER = b64DecodeUnicode(b64)
		let AB = stringToArrayBuffer(DER)

		return AB
	}
	static async generateKeys() {
		let { publicKey, privateKey } = await subtle.generateKey(
			{ name: 'RSA-OAEP', modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: 'SHA-256' },
			true,
			['encrypt', 'decrypt'],
		)

		let privateKeyB64 = this.ABtoB64(await subtle.exportKey('pkcs8', privateKey))
		let publicKeyB64 = this.ABtoB64(await subtle.exportKey('spki', publicKey))

		return { publicKey: publicKeyB64, privateKey: privateKeyB64 }
	}

	static async importKey(key, type = 'private') {
		let extractedKey = await subtle.importKey(
			type == 'private' ? 'pkcs8' : 'spki',
			this.B64toAB(key),
			{ name: 'RSA-OAEP', hash: { name: 'SHA-256' } },
			true,
			type == 'private' ? ['decrypt'] : ['encrypt'],
		)

		return extractedKey
	}
	static async generateSigningKeys() {
		let { publicKey, privateKey } = await subtle.generateKey(
			{ name: 'RSA-PSS', modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: 'SHA-256' },
			true,
			['sign', 'verify'],
		)

		let privateKeyB64 = this.ABtoB64(await subtle.exportKey('pkcs8', privateKey))
		let publicKeyB64 = this.ABtoB64(await subtle.exportKey('spki', publicKey))

		return { publicKey: publicKeyB64, privateKey: privateKeyB64 }
	}

	static async importSigningKey(key, type = 'private') {
		let extractedKey = await subtle.importKey(
			type == 'private' ? 'pkcs8' : 'spki',
			this.B64toAB(key),
			{ name: 'RSA-PSS', hash: { name: 'SHA-256' } },
			false,
			type == 'private' ? ['sign'] : ['verify'],
		)

		return extractedKey
	}
}

module.exports = { KeysGenerator }

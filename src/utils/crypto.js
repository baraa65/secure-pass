const CryptoJS = require('crypto-js')

class Crypto {
	static RSA
	key
	disable = false

	static init(RSA) {
		this.RSA = new RSA()
	}

	setKey(key) {
		this.key = key
	}

	enc(m) {
		if (this.disable) return m
		let enc = CryptoJS.AES.encrypt(JSON.stringify(m), this.key).toString()
		let mac = CryptoJS.HmacSHA256(enc, this.key).toString()

		return { enc, mac }
	}

	dec(data) {
		if (this.disable) return data
		let m = CryptoJS.AES.decrypt(data.enc, this.key)
		let mac = CryptoJS.HmacSHA256(data.enc, this.key)

		if (mac != data.mac) throw `Invalid MAC (${mac}, ${data.mac})`

		let mStr = m.toString(CryptoJS.enc.Utf8)

		return data?.enc && mStr ? JSON.parse(mStr) : undefined
	}

	encStr(m) {
		return CryptoJS.AES.encrypt(m, this.key).toString()
	}

	decStr(enc) {
		return CryptoJS.AES.decrypt(enc, this.key).toString()
	}

	hash(str) {
		return CryptoJS.SHA256(str).toString()
	}

	keyLoaded(cb) {
		if (this.key) return cb()

		setTimeout(() => {
			this.keyLoaded(cb)
		}, 200)
	}
}

module.exports = { Crypto }

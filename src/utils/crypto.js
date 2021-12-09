const CryptoJS = require('crypto-js')

class Crypto {
	static key
	static RSA
	static disable = false

	static init(RSA) {
		this.RSA = new RSA()
	}

	static setKey(key) {
		this.key = key
	}

	static enc(m) {
		if (this.disable) return m
		let enc = CryptoJS.AES.encrypt(JSON.stringify(m), this.key).toString()
		let mac = CryptoJS.HmacSHA256(enc, this.key).toString()

		return { enc, mac }
	}

	static dec(data) {
		if (this.disable) return data
		let m = CryptoJS.AES.decrypt(data.enc, this.key)
		let mac = CryptoJS.HmacSHA256(data.enc, this.key)

		if (mac != data.mac) throw `Invalid MAC (${mac}, ${data.mac})`

		let mStr = m.toString(CryptoJS.enc.Utf8)

		return data?.enc && mStr ? JSON.parse(mStr) : undefined
	}

	static keyLoaded(cb) {
		if (this.key) return cb()

		setTimeout(() => {
			this.keyLoaded(cb)
		}, 200)
	}
}

module.exports = { Crypto }

const express = require('express')
const app = express()
const { serverRSA } = require('../backend/crypto/server-rsa')
const keys = require('./keys')

serverRSA.setKeys(keys)

app.use(express.json())

app.post('/cert', async (req, res) => {
	let signature = await serverRSA.sign(req.body)

	res.send({ cert: { ...req.body, signature } })
})

app.listen(3001)

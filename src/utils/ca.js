import { ClientRSA } from './client-rsa'

const keys = require('../../CA/keys')

let certVerifier = new ClientRSA()

certVerifier.setKeys(keys)

export { certVerifier }

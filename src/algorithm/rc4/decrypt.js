const { encrypt } = require('./encrypt')

const decrypt = (ciphertext, key) => {
  return encrypt(ciphertext, key)
}

module.exports = { decrypt }
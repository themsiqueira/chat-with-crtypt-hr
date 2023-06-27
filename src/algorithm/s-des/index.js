const { encrypt } = require('./encrypt');
const { decrypt } = require('./decrypt');

module.exports = { encryptSDES: encrypt, decryptSDES: decrypt }
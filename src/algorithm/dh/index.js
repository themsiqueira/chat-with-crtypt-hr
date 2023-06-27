const { encrypt } = require('./encrypt');
const { decrypt } = require('./decrypt');

module.exports = { encryptDH: encrypt, decryptDH: decrypt }
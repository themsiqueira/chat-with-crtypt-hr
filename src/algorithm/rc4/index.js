const { decrypt } = require("./decrypt");
const { encrypt } = require("./encrypt");

module.exports = { decryptRC4: decrypt, encryptRC4: encrypt }
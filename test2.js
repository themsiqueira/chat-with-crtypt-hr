const crypto = require('crypto');

const key = crypto.randomBytes(8); // Generate an 8-byte (64-bit) key
const algorithm = 'des-ede';
const cipher = crypto.createCipher(algorithm, key);
const plaintext = 'Hello, S-DES!';

let encrypted = cipher.update(plaintext, 'utf8', 'hex');
encrypted += cipher.final('hex');

const decipher = crypto.createDecipher(algorithm, key);
let decrypted = decipher.update(encrypted, 'hex', 'utf8');
decrypted += decipher.final('utf8');

console.log('Plaintext:', plaintext);
console.log('Encrypted:', encrypted);
console.log('Decrypted:', decrypted);

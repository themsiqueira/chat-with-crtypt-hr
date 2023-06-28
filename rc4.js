class RC4 {
  constructor(key) {
    this.SIZE = 256;
    this.BYTE_SIZE = 8;
    this.text = '';
    this.key = key;
    this.S = new Array(this.SIZE);
    this.T = new Array(this.SIZE);
  }

  encrypt(text) {
    this.text = text;

    let i, j = 0;

    // initialize S and T
    for (i = 0; i < this.SIZE; i++) {
      this.S[i] = String.fromCharCode(i);
      this.T[i] = this.key.charAt(i % this.key.length);
    }

    // permutation of S
    j = 0;
    for (i = 0; i < this.SIZE; i++) {
      j = (j + this.S[i].charCodeAt() + this.T[i].charCodeAt()) % this.SIZE;
      this.swap(i, j);
    }

    return this.streamGeneration();
  }

  decrypt(text) {
    const splitted = text.split(':');
    const cypherText = new Array(splitted.length);

    for (let i = 0; i < splitted.length; i++) {
      const n = parseInt(splitted[i], 16);
      cypherText[i] = this.convertDecimalToBinary(n);
    }

    let i, j = 0;

    // initialize S and T
    for (i = 0; i < this.SIZE; i++) {
      this.S[i] = String.fromCharCode(i);
      this.T[i] = this.key.charAt(i % this.key.length);
    }

    // permutation of S
    j = 0;
    for (i = 0; i < this.SIZE; i++) {
      j = (j + this.S[i].charCodeAt() + this.T[i].charCodeAt()) % this.SIZE;
      this.swap(i, j);
    }

    return this.streamGenerationDecrypt(cypherText);
  }

  streamGeneration() {
    let i = 0, j = 0, l = 0, k, t;

    const currentCharSet = require('crypto').constants.UTF8;
    const bytes = Buffer.from(this.text, 'utf8');
    const plainText = Array.from(bytes);
    let encryptedString = '';

    while (l < this.text.length) {
      i = (i + 1) % this.SIZE;
      j = (j + this.S[i].charCodeAt()) % this.SIZE;

      this.swap(i, j);

      t = (this.S[i].charCodeAt() + this.S[j].charCodeAt()) % this.SIZE;
      k = this.S[t].charCodeAt();

      const binaryK = this.convertDecimalToBinary(k);
      const binaryText = this.convertDecimalToBinary(plainText[l]);
      const xorResult = this.getXorBits(binaryK, binaryText);

      const result = this.convertBinaryToChar(xorResult);
      const hexString = result.toString(16);
      encryptedString += hexString + ':';

      l++;
    }

    return encryptedString;
  }

  streamGenerationDecrypt(cypherText) {
    let i = 0, j = 0, l = 0, k, t;
    const result = new Array(cypherText.length);

    while (l < cypherText.length) {
      i = (i + 1) % this.SIZE;
      j = (j + this.S[i].charCodeAt()) % this.SIZE;

      this.swap(i, j);

      t = (this.S[i].charCodeAt() + this.S[j].charCodeAt()) % this.SIZE;
      k = this.S[t].charCodeAt();

      const binaryK = this.convertDecimalToBinary(k);
      const xorResult = this.getXorBits(binaryK, cypherText[l]);

      result[l] = this.convertBinaryToChar(xorResult);
      l++;
    }

    return String.fromCharCode.apply(null, result);
  }

  getXorBits(bits1, bits2) {
    const result = new Array(bits1.length);
    for (let i = 0; i < bits1.length; i++) {
      const resultBit = bits1[i] === bits2[i] ? 0 : 1;
      result[i] = resultBit;
    }

    return result;
  }

  convertBinaryToChar(binary) {
    let arr = 0;
    const length = binary.length - 1;

    for (let i = length; i > -1; i--) {
      arr += Math.pow(2, length - i) * binary[i];
    }

    return String.fromCharCode(arr);
  }

  convertDecimalToBinary(decimal) {
    const binary = new Array(this.BYTE_SIZE);
    let i = this.BYTE_SIZE - 1;

    while (i >= 0) {
      binary[i] = decimal % 2;
      decimal = Math.floor(decimal / 2);
      i--;
    }

    return binary;
  }

  swap(i, j) {
    const aux = this.S[i];
    this.S[i] = this.S[j];
    this.S[j] = aux;
  }
}

const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const rc4 = new RC4([1,0,0,0,0,0,0,0,0,0])
const encrypted = rc4.encrypt('hello world')
console.log(encrypted)
const decrypted = rc4.decrypt(encrypted)
console.log(decrypted)
(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const decrypt = (encryptedMessage, sharedKey) => {
  const decryptedMessage = [];

  const encryptedCodes = encryptedMessage.split(',');
  for (let i = 0; i < encryptedCodes.length; i++) {
    const encryptedCharCode = parseInt(encryptedCodes[i]);
    const decryptedCharCode = encryptedCharCode ^ sharedKey;
    decryptedMessage.push(String.fromCharCode(decryptedCharCode));
  }

  return decryptedMessage.join('');
}

module.exports = { decrypt }
},{}],2:[function(require,module,exports){
const encrypt = (message, sharedKey) => {
  const encryptedMessage = [];

  for (let i = 0; i < message.length; i++) {
    const charCode = message.charCodeAt(i);
    const encryptedCharCode = charCode ^ sharedKey;
    encryptedMessage.push(encryptedCharCode);
  }

  return encryptedMessage.join(',');
}

module.exports = { encrypt }
},{}],3:[function(require,module,exports){
const { encrypt } = require('./encrypt');
const { decrypt } = require('./decrypt');

module.exports = { encryptDH: encrypt, decryptDH: decrypt }
},{"./decrypt":1,"./encrypt":2}],4:[function(require,module,exports){
const { encrypt } = require('./encrypt')

const decrypt = (ciphertext, key) => {
  return encrypt(ciphertext, key)
}

module.exports = { decrypt }
},{"./encrypt":5}],5:[function(require,module,exports){
const { initializeState } = require("./utils/initialize-state")
const { generateKeyStream } = require("./utils/generate-key-stream")

const encrypt = (plaintext, key) => {
  const state = initializeState(key)
  const keyStream = generateKeyStream(state, plaintext.length)
  const ciphertext = new Array(plaintext.length)

  for (let i = 0; i < plaintext.length; i++) {
    ciphertext[i] = String.fromCharCode(plaintext[i].charCodeAt() ^ keyStream[i])
  }

  return ciphertext.join('')
}

module.exports = { encrypt }
},{"./utils/generate-key-stream":7,"./utils/initialize-state":8}],6:[function(require,module,exports){
const { decrypt } = require("./decrypt");
const { encrypt } = require("./encrypt");

module.exports = { decryptRC4: decrypt, encryptRC4: encrypt }
},{"./decrypt":4,"./encrypt":5}],7:[function(require,module,exports){
const generateKeyStream = (state, length) => {
  const keyStream = new Array(length)
  let i = 0
  let j = 0

  for (let k = 0; k < length; k++) {
    i = (i + 1) % 256
    j = (j + state[i]) % 256
    swap(state, i, j)
    const t = (state[i] + state[j]) % 256
    keyStream[k] = state[t]
  }

  return keyStream
}

module.exports = { generateKeyStream }
},{}],8:[function(require,module,exports){
const { swap } = require("./swap");

const initializeState = (key) => {
  const state = new Array(256);
  let j = 0;

  for (let i = 0; i < 256; i++) {
    state[i] = i;
  }

  for (let i = 0; i < 256; i++) {
    j = (j + state[i] + key[i % key.length].charCodeAt()) % 256
    swap(state, i, j)
  }

  return state;
}

module.exports = { initializeState }
},{"./swap":9}],9:[function(require,module,exports){
const swap = (arr, i, j) => {
  const temp = arr[i]
  arr[i] = arr[j]
  arr[j] = temp
}

module.exports = { swap }
},{}],10:[function(require,module,exports){
const algorithmEnum = {
  SDES: 'SDES',
  RC4: 'RC4',
}

const cipherBlockEnum = {
  ECB: 'ECB',
  CBC: 'CBC'
}

module.exports = { algorithmEnum, cipherBlockEnum }
},{}],11:[function(require,module,exports){
'use strict'
const { algorithmEnum } = require("../constants/algorithm")
// const { decryptSDES } = require("../algorithm/s-des")
const { decryptRC4 } = require("../algorithm/rc4")
const { decryptDH } = require("../algorithm/dh")

function decryptMessage(message, key, algorithm, sharedKey) {
  console.log('decryptMessage', { message, key, algorithm, sharedKey })
  const messageDHDecrypted = decryptDH(message, sharedKey)

  switch (algorithm) {
    case algorithmEnum.SDES:
      console.log('SDES')
      // return decryptSDES(messageDHDecrypted, key)
    case algorithmEnum.RC4:
      console.log('RC4')
      return decryptRC4(messageDHDecrypted, key)
    default:
      console.log('Invalid algorithm', algorithm)
      return ''
  }
}

module.exports = decryptMessage
},{"../algorithm/dh":3,"../algorithm/rc4":6,"../constants/algorithm":10}]},{},[11]);

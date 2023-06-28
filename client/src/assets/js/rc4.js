const swap = (arr, i, j) => {
  const temp = arr[i]
  arr[i] = arr[j]
  arr[j] = temp
}

const initializeState = (key) => {
  const state = new Array(256);
  let j = 0;

  for (let i = 0; i < 256; i++) {
    state[i] = i;
  }

  for (let i = 0; i < 256; i++) {
    if (!key) continue
    j = (j + state[i] + key[i % key.length].charCodeAt()) % 256
    swap(state, i, j)
  }

  return state;
}

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
const encryptAndDecrypt = (plaintextOrCiphertext, key) => {
  const state = initializeState(key)
  const keyStream = generateKeyStream(state, plaintextOrCiphertext.length)
  const ciphertext = new Array(plaintextOrCiphertext.length)

  for (let i = 0; i < plaintextOrCiphertext.length; i++) {
    ciphertext[i] = String.fromCharCode(plaintextOrCiphertext[i].charCodeAt() ^ keyStream[i])
  }

  return ciphertext.join('')
}

export class RC4 {
  constructor(key) {
    this.key = key
    this.encrypt = encryptAndDecrypt
    this.decrypt = encryptAndDecrypt
  }

}
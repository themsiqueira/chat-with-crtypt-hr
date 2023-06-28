import { initializeState } from "./utils/initialize-state"
import { generateKeyStream } from "./utils/generate-key-stream"

export const encrypt = (plaintext, key) => {
  const state = initializeState(key)
  const keyStream = generateKeyStream(state, plaintext?.length)
  const ciphertext = new Array(plaintext?.length)

  for (let i = 0; i < plaintext?.length; i++) {
    ciphertext[i] = String.fromCharCode(plaintext[i].charCodeAt() ^ keyStream[i])
  }

  return ciphertext.join('')
}

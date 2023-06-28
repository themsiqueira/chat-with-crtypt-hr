import { encrypt } from './encrypt'

export const decrypt = (ciphertext, key) => {
  return encrypt(ciphertext, key)
}
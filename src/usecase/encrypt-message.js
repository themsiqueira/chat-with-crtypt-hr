'use strict'
const { encryptDH } = require("../algorithm/dh")
const { encryptRC4 } = require("../algorithm/rc4")
// const { encryptSDES } = require("../algorithm/s-des")
const { algorithmEnum } = require("../constants/algorithm")

export default function encryptMessage(message, key, algorithm, sharedKey) {
  console.log('encryptMessage', { message, key, algorithm, sharedKey })
  const messageDHEncrypted = encryptDH(message, sharedKey)

  console.log('encryptMessage', { message, key, algorithm })
  switch (algorithm) {
    case algorithmEnum.SDES:
      console.log('SDES')
      // return encryptSDES(messageDHEncrypted, key)
    case algorithmEnum.RC4:
      return encryptRC4(messageDHEncrypted, key)
    default:
      console.log('Invalid algorithm')
      return ''
  }
}

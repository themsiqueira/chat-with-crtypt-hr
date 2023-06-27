'use strict'
const { algorithmEnum } = require("../constants/algorithm")
// const { decryptSDES } = require("../algorithm/s-des")
const { decryptRC4 } = require("../algorithm/rc4")
const { decryptDH } = require("../algorithm/dh")

export default function decryptMessage(message, key, algorithm, sharedKey) {
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

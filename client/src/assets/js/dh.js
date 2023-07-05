import bigInt from 'big-integer';
import { RC4 } from './rc4';

export function calculateSharedSecret(privateKey, base, prime) {
  return bigInt(base) ** bigInt(privateKey) % bigInt(prime);
}

export function encryptMessageDH(message, key) {
  const algorithmInstance = new RC4(key)
  return algorithmInstance.encrypt(JSON.stringify(message));
}

export function decryptMessageDH(encryptedMessage, key) {
  const algorithmInstance = new RC4(key)
  return JSON.parse(algorithmInstance.decrypt(encryptedMessage));
}

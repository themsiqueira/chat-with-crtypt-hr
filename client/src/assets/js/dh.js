import bigInt from 'big-integer';
import { RC4 } from './rc4';

// Função para calcular o valor compartilhado entre os usuários
export function calculateSharedSecret(privateKey, base, prime) {
  return bigInt(base) ** bigInt(privateKey) % bigInt(prime);
}

// Função para criptografar uma mensagem usando RC4
export function encryptMessageDH(message, key) {
  const algorithmInstance = new RC4(key)
  return algorithmInstance.encrypt(JSON.stringify(message));
}

// Função para descriptografar uma mensagem usando RC4
export function decryptMessageDH(encryptedMessage, key) {
  const algorithmInstance = new RC4(key)
  return JSON.parse(algorithmInstance.decrypt(encryptedMessage));
}

const { decipherECBBlock, decipherCBCBlock } = require("./utils/decipher-block");


// Função para decifrar uma mensagem usando o algoritmo S-DES no modo ECB ou CBC
function decryptSDES(ciphertext, key, mode, iv) {
  const blocks = [];
  const blockSize = 8; // Tamanho fixo de bloco para S-DES
  let previousBlock;

  // Divide o texto cifrado em blocos de tamanho fixo
  for (let i = 0; i < ciphertext.length; i += blockSize) {
    const block = Array.from(ciphertext.slice(i, i + blockSize), (char) => char.charCodeAt(0));
    let decipheredBlock;

    if (mode === 'ECB') {
      decipheredBlock = decipherECBBlock(block, key);
    } else if (mode === 'CBC') {
      if (previousBlock) {
        decipheredBlock = decipherCBCBlock(block, key, previousBlock);
      } else {
        decipheredBlock = decipherCBCBlock(block, key, iv);
      }
      previousBlock = block;
    }

    blocks.push(...decipheredBlock);
  }

  return blocks.map((num) => String.fromCharCode(num)).join('').trim();
}

// Exemplo de uso
const ciphertextECB = 'ÈÞ¦Ú½5Äj±Â';
const ciphertextCBC = 'ÈÞ¯öµLÐTÅß`¸Ý°ö¨';
const key = '1010000010'; // Chave de 10 bits
const iv = '00000000'; // Vetor de inicialização (para o modo CBC)

const plaintextECB = decryptSDES(ciphertextECB, key, 'ECB');
const plaintextCBC = decryptSDES(ciphertextCBC, key, 'CBC', iv);

console.log('Ciphertext ECB:', ciphertextECB);
console.log('Plaintext ECB:', plaintextECB);
console.log('Ciphertext CBC:', ciphertextCBC);
console.log('Plaintext CBC:', plaintextCBC);

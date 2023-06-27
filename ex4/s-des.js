// Tabelas de permutação e substituição
const IP = [2, 6, 3, 1, 4, 8, 5, 7];
const IP_inverse = [4, 1, 3, 5, 7, 2, 8, 6];
const EP = [4, 1, 2, 3, 2, 3, 4, 1];
const P4 = [2, 4, 3, 1];
const P8 = [6, 3, 7, 4, 8, 5, 10, 9];
const P10 = [3, 5, 2, 7, 4, 10, 1, 9, 8, 6];
const S0 = [
  [1, 0, 3, 2],
  [3, 2, 1, 0],
  [0, 2, 1, 3],
  [3, 1, 3, 2]
];
const S1 = [
  [0, 1, 2, 3],
  [2, 0, 1, 3],
  [3, 0, 1, 0],
  [2, 1, 0, 3]
];

// Função auxiliar para permutação de bits
function permute(input, table) {
  return table.map((bitIndex) => input[bitIndex - 1]);
}

// Função auxiliar para realizar uma operação XOR entre dois arrays
function xor(a, b) {
  return a.map((bit, index) => bit ^ b[index]);
}

// Função auxiliar para dividir um bloco em duas partes
function divideBlock(block) {
  const mid = Math.ceil(block.length / 2);
  return [block.slice(0, mid), block.slice(mid)];
}

// Função auxiliar para expandir um bloco de 4 bits para 8 bits
function expand(block) {
  return permute(block, EP);
}

// Função auxiliar para realizar uma substituição usando as S-Boxes
function substitute(block, sBox) {
  const row = parseInt(`${block[0]}${block[3]}`, 2);
  const col = parseInt(`${block[1]}${block[2]}`, 2);
  const value = sBox[row][col];
  return value.toString(2).padStart(2, '0').split('').map(Number);
}

// Função auxiliar para permutação final de um bloco de 4 bits
function permutate4(block) {
  return permute(block, P4);
}

// Função auxiliar para permutação final de um bloco de 8 bits
function permutate8(block) {
  return permute(block, P8);
}

// Função auxiliar para gerar uma chave de 10 bits a partir da chave de entrada
function generateKey(key) {
  return permute(key, P10);
}

// Função auxiliar para realizar as substituições e permutações no processo de F-Function
function fFunction(block, key) {
  const expanded = expand(block);
  const xored = xor(expanded, key);
  const substituted = [
    ...substitute(xored.slice(0, 4), S0),
    ...substitute(xored.slice(4), S1)
  ];
  return permutate4(substituted);
}

// Função auxiliar para cifrar um bloco usando o algoritmo S-DES
function cipherBlock(block, key) {
  const [left, right] = divideBlock(block);
  const key1 = generateKey(key);
  const key2 = generateKey(key.slice(1) + key[0]); // Chave secundária
  const fResult1 = fFunction(right, key1);
  const xored = xor(left, fResult1);
  const fResult2 = fFunction(xored, key2);
  const newLeft = xor(fResult2, right);
  return [...newLeft, ...right];
}

// Função para cifrar um bloco no modo ECB (Electronic Codebook)
function cipherECBBlock(block, key) {
  return cipherBlock(block, key);
}

// Função para cifrar um bloco no modo CBC (Cipher Block Chaining)
function cipherCBCBlock(block, key, iv) {
  const xored = xor(block, iv);
  return cipherBlock(xored, key);
}

// Função para cifrar uma mensagem usando o algoritmo S-DES no modo ECB ou CBC
function encryptSDES(message, key, mode, iv) {
  const blocks = [];
  const blockSize = 8; // Tamanho fixo de bloco para S-DES
  let previousBlock;

  // Padroniza a mensagem para o tamanho do bloco
  const paddedMessage = message.padEnd(Math.ceil(message.length / blockSize) * blockSize, ' ');

  // Divide a mensagem em blocos de tamanho fixo
  for (let i = 0; i < paddedMessage.length; i += blockSize) {
    const block = Array.from(paddedMessage.slice(i, i + blockSize), (char) => char.charCodeAt(0));
    let cipheredBlock;

    if (mode === 'ECB') {
      cipheredBlock = cipherECBBlock(block, key);
    } else if (mode === 'CBC') {
      if (previousBlock) {
        cipheredBlock = cipherCBCBlock(block, key, previousBlock);
      } else {
        cipheredBlock = cipherCBCBlock(block, key, iv);
      }
      previousBlock = cipheredBlock;
    }

    blocks.push(...cipheredBlock);
  }

  return blocks.map((num) => String.fromCharCode(num)).join('');
}

// Exemplo de uso
const message = 'Hello, S-DES!';
const key = '1010000010'; // Chave de 10 bits
const iv = '00000000'; // Vetor de inicialização (para o modo CBC)
const encryptedECB = encryptSDES(message, key, 'ECB');
const encryptedCBC = encryptSDES(message, key, 'CBC', iv);

console.log('Plaintext:', message);
console.log('Encrypted ECB:', encryptedECB);
console.log('Encrypted CBC:', encryptedCBC);

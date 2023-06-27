// Função para permutação inicial
function initialPermutation(input) {
  const permutation = [2, 6, 3, 1, 4, 8, 5, 7];
  let output = '';
  for (let i = 0; i < permutation.length; i++) {
    output += input.charAt(permutation[i] - 1);
  }
  return output;
}

// Função para permutação final
function finalPermutation(input) {
  const permutation = [4, 1, 3, 5, 7, 2, 8, 6];
  let output = '';
  for (let i = 0; i < permutation.length; i++) {
    output += input.charAt(permutation[i] - 1);
  }
  return output;
}

// Função para permutação P4
function permuteP4(input) {
  const permutation = [2, 4, 3, 1];
  let output = '';
  for (let i = 0; i < permutation.length; i++) {
    output += input.charAt(permutation[i] - 1);
  }
  return output;
}

// Função para permutação P8
function permuteP8(input) {
  const permutation = [6, 3, 7, 4, 8, 5, 10, 9];
  let output = '';
  for (let i = 0; i < permutation.length; i++) {
    output += input.charAt(permutation[i] - 1);
  }
  return output;
}

// Função para permutação P10
function permuteP10(input) {
  const permutation = [3, 5, 2, 7, 4, 10, 1, 9, 8, 6];
  let output = '';
  for (let i = 0; i < permutation.length; i++) {
    output += input.charAt(permutation[i] - 1);
  }
  return output;
}

// Função para shift para a esquerda
function shiftLeft(input) {
  return input.slice(1) + input.charAt(0);
}

// Função para gerar as chaves
function generateKeys(key) {
  const keyP10 = permuteP10(key);
  let leftPart = shiftLeft(keyP10.slice(0, 5));
  let rightPart = shiftLeft(keyP10.slice(5));
  const key1 = permuteP8(leftPart + rightPart);

  leftPart = shiftLeft(shiftLeft(leftPart));
  rightPart = shiftLeft(shiftLeft(rightPart));
  const key2 = permuteP8(leftPart + rightPart);

  return [key1, key2];
}

// Função para aplicar a função F
function applyF(input, key) {
  const expanded = input.charAt(3) + input.charAt(0) + input.charAt(1) + input.charAt(2) +
                   input.charAt(1) + input.charAt(2) + input.charAt(3) + input.charAt(0);
  const xorResult = xor(expanded, key.substring(0, 8));
  const s0 = [
    ['01', '00', '11', '10'],
    ['11', '10', '01', '00'],
    ['00', '10', '01', '11'],
    ['11', '01', '00', '10']
  ];
  const s1 = [
    ['00', '01', '10', '11'],
    ['10', '00', '01', '11'],
    ['11', '00', '01', '00'],
    ['10', '01', '00', '11']
  ];
  const s0Row = parseInt(xorResult.slice(0, 2), 2); // Corrigido: ajuste para começar de 0
  const s0Column = parseInt(xorResult.slice(2, 4), 2); // Corrigido: ajuste para começar de 0
  const s1Row = parseInt(xorResult.slice(4, 6), 2); // Corrigido: ajuste para começar de 0
  const s1Column = parseInt(xorResult.slice(6, 8), 2); // Corrigido: ajuste para começar de 0
  const s0Output = s0[s0Row][s0Column];
  const s1Output = s1[s1Row][s1Column];
  const fOutput = s0Output + s1Output;
  return permuteP4(fOutput);
}

function textToBinary(text) {
  let binary = '';
  for (let i = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i);
    const binaryChar = charCode.toString(2).padStart(8, '0');
    binary += binaryChar;
  }
  return binary;
}

// Função para converter o texto binário de volta para o formato original
function binaryToText(binary) {
  let text = '';
  for (let i = 0; i < binary.length; i += 8) {
    const binaryChar = binary.substr(i, 8);
    const charCode = parseInt(binaryChar, 2);
    const char = String.fromCharCode(charCode);
    text += char;
  }
  return text;
}



// Função para decifrar uma mensagem utilizando S-DES
function decrypt(ciphertext, key) {
  const keys = generateKeys(key);
  const initialPermuted = initialPermutation(ciphertext);
  let leftPart = initialPermuted.slice(0, 4);
  let rightPart = initialPermuted.slice(4);
  const round1 = applyF(rightPart, keys[0]); // Utiliza a primeira chave
  const xorResult = xor(leftPart, round1);
  leftPart = rightPart;
  rightPart = xorResult;
  const round2 = applyF(rightPart, keys[1]); // Utiliza a segunda chave
  const plaintext = finalPermutation(rightPart + round2 + leftPart);
  return plaintext;
}


// Função para realizar a operação XOR entre duas strings binárias
function xor(a, b) {
  let output = '';
  for (let i = 0; i < a.length; i++) {
    output += a.charAt(i) === b.charAt(i) ? '0' : '1';
  }
  return output;
}

// Função para cifrar uma mensagem utilizando S-DES
function encrypt(plaintext, key) {
  const keys = generateKeys(key);
  const initialPermuted = initialPermutation(plaintext);
  let leftPart = initialPermuted.slice(0, 4);
  let rightPart = initialPermuted.slice(4);
  const round1 = applyF(rightPart, keys[0]);
  const xorResult = xor(leftPart, round1);
  leftPart = rightPart;
  rightPart = xorResult;
  const round2 = applyF(rightPart, keys[1]);
  const ciphertext = finalPermutation(rightPart + round2 + leftPart);
  return ciphertext;
}

const plaintext = 'OLA MUNDO';
const key = '1010000010';

console.log('Plaintext:', plaintext);
console.log('Key:', key);
console.log(textToBinary(plaintext));
console.log(binaryToText(textToBinary(plaintext)))

// Cifrar o texto
const ciphertext = encrypt(textToBinary(plaintext), key);
console.log('Ciphertext:', ciphertext);

// Decifrar o texto
const decryptedText = decrypt(ciphertext, key);
console.log('Decrypted Text:', decryptedText);

console.log('Decrypted Text:', binaryToText(decryptedText));

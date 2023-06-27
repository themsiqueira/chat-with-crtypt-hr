const { xor } = require('./xor');
const { divideBlock } = require('./divide-block');
const { generateTenBitsKey } = require('./generate-ten-bits-key');
const { replaceAndPermute } = require('./replace-and-permute');

const cipherBlock = (block, key) => {
  const [left, right] = divideBlock(block);
  const key1 = generateTenBitsKey(key);
  const key2 = generateTenBitsKey(key.slice(1) + key[0]); // Chave secundária
  const fResult1 = replaceAndPermute(right, key1);
  const xored = xor(left, fResult1);
  const fResult2 = replaceAndPermute(xored, key2);
  const newLeft = xor(fResult2, right);
  return [...newLeft, ...right];
}

const cipherECBBlock = (block, key) => {
  return cipherBlock(block, key);
}

const cipherCBCBlock = (block, key, iv) => {
  const xored = xor(block, iv);
  return cipherBlock(xored, key);
}

module.exports = { cipherBlock, cipherECBBlock, cipherCBCBlock }
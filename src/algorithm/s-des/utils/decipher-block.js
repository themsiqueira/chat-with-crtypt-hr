const { xor } = require('./xor');
const { divideBlock } = require('./divide-block');
const { generateTenBitsKey } = require('./generate-ten-bits-key');
const { replaceAndPermute } = require('./replace-and-permute');

const decipherBlock = (block, key) => {
  const [left, right] = divideBlock(block);
  const key1 = generateTenBitsKey(key);
  const key2 = generateTenBitsKey(key.slice(1) + key[0]); // Chave secundária
  const fResult2 = replaceAndPermute(left, key2);
  const xored = xor(right, fResult2);
  const fResult1 = replaceAndPermute(xored, key1);
  const newRight = xor(fResult1, left);
  return [...newRight, ...left];
}

const decipherECBBlock = (block, key) => {
  return decipherBlock(block, key);
}

const decipherCBCBlock = (block, key, iv) => {
  const decipheredBlock = decipherBlock(block, key);
  const xored = xor(decipheredBlock, iv);
  return xored;
}


module.exports = { decipherBlock, decipherECBBlock, decipherCBCBlock };
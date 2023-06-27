const { xor } = require('./xor');
const { expand } = require('./expand');
const { S0, S1 } = require('../../../constants/s-des');
const { replaceSBoxes } = require('./replace-s-boxes');

const replaceAndPermute = (block, key) => {
  const expanded = expand(block);
  const xored = xor(expanded, key);
  const substituted = [
    ...replaceSBoxes(xored.slice(0, 4), S0),
    ...replaceSBoxes(xored.slice(4), S1)
  ];
  return permuteFour(substituted);
}

module.exports = { replaceAndPermute }
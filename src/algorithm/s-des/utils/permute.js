const { P4, P8 } = require("../../../constants/s-des");

const permute = (input, table) => {
  return table.map((bitIndex) => input[bitIndex - 1]);
}

const permuteFour = (block) => {
  return permute(block, P4);
}

const permuteEight = (block) => {
  return permute(block, P8);
}

module.exports = { permute, permuteFour, permuteEight }
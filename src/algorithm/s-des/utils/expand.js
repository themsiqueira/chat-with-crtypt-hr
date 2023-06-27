const { permute } = require('./permute.js');
const { EP } = require("../../../constants/s-des");

const expand = (block) => {
  return permute(block, EP);
}

module.exports = { expand }
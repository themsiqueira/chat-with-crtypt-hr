const { P10 } = require("../../../constants/s-des");
const { permute } = require("./permute");

const generateTenBitsKey = (key) => {
  return permute(key, P10);
}

module.exports = { generateTenBitsKey }
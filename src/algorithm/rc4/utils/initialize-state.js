const { swap } = require("./swap");

const initializeState = (key) => {
  const state = new Array(256);
  let j = 0;

  for (let i = 0; i < 256; i++) {
    state[i] = i;
  }

  for (let i = 0; i < 256; i++) {
    j = (j + state[i] + key[i % key.length].charCodeAt()) % 256
    swap(state, i, j)
  }

  return state;
}

module.exports = { initializeState }
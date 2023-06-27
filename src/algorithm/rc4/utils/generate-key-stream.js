const generateKeyStream = (state, length) => {
  const keyStream = new Array(length)
  let i = 0
  let j = 0

  for (let k = 0; k < length; k++) {
    i = (i + 1) % 256
    j = (j + state[i]) % 256
    swap(state, i, j)
    const t = (state[i] + state[j]) % 256
    keyStream[k] = state[t]
  }

  return keyStream
}

module.exports = { generateKeyStream }
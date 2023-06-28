import { swap } from './swap';

export const initializeState = (key) => {
  let state = new Array(256);
  try {
    let j = 0;

    for (let i = 0; i < 256; i++) {
      state[i] = i;
    }

    for (let i = 0; i < 256; i++) {
      j = (j + state[i] + key[i % (key?.length || 0)].charCodeAt()) % 256
      swap(state, i, j)
    }
  } catch (error) {
    console.log(error)
  }

  return state;
}
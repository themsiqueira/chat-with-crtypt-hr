const replaceSBoxes = (block, sBox) => {
  const row = parseInt(`${block[0]}${block[3]}`, 2);
  const col = parseInt(`${block[1]}${block[2]}`, 2);
  const value = sBox[row][col];
  return value.toString(2).padStart(2, '0').split('').map(Number);
}

module.exports = { replaceSBoxes }
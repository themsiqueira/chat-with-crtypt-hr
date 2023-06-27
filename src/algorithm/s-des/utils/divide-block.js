const divideBlock = (block) => {
  const mid = Math.ceil(block.length / 2);
  return [block.slice(0, mid), block.slice(mid)];
}

module.exports = { divideBlock }
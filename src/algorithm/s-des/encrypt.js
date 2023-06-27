const { cipherBlockEnum } = require("../../constants/algorithm");

const encrypt = (message, key, mode, iv) => {
  const blocks = [];
  const blockSize = 8;
  let previousBlock;

  const paddedMessage = message.padEnd(Math.ceil(message.length / blockSize) * blockSize, ' ');

  for (let i = 0; i < paddedMessage.length; i += blockSize) {
    const block = Array.from(paddedMessage.slice(i, i + blockSize), (char) => char.charCodeAt(0));
    let cipheredBlock;

    if (mode === cipherBlockEnum.ECB) {
      cipheredBlock = cipherECBBlock(block, key);
    } else if (mode === cipherBlockEnum.CBC) {
      if (previousBlock) {
        cipheredBlock = cipherCBCBlock(block, key, previousBlock);
      } else {
        cipheredBlock = cipherCBCBlock(block, key, iv);
      }
      previousBlock = cipheredBlock;
    }

    blocks.push(...cipheredBlock);
  }

  return blocks.map((num) => String.fromCharCode(num)).join('');
}

export const decrypt = (encryptedMessage, sharedKey) => {
  const decryptedMessage = [];

  const encryptedCodes = encryptedMessage.split(',');
  for (let i = 0; i < encryptedCodes?.length; i++) {
    const encryptedCharCode = parseInt(encryptedCodes[i]);
    const decryptedCharCode = encryptedCharCode ^ sharedKey;
    decryptedMessage.push(String.fromCharCode(decryptedCharCode));
  }

  return decryptedMessage.join('');
}
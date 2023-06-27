const encrypt = (message, sharedKey) => {
  const encryptedMessage = [];

  for (let i = 0; i < message.length; i++) {
    const charCode = message.charCodeAt(i);
    const encryptedCharCode = charCode ^ sharedKey;
    encryptedMessage.push(encryptedCharCode);
  }

  return encryptedMessage.join(',');
}

module.exports = { encrypt }
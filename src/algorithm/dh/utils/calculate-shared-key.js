const calculateSharedKey = (publicKey) => {
  const privateExponent = bigInt.randBetween(2, prime.minus(2));
  const privateKey = primitiveRoot.modPow(privateExponent, prime);
  const sharedKey = bigInt(publicKey).modPow(privateExponent, prime);
  return { privateKey: privateKey.toString(), sharedKey: sharedKey.toString() };
}

module.exports = calculateSharedKey
class DES {
  constructor(key) {
    this.originalKey = key;
  }

  static Key = class {
    constructor(key) {
      this.originalKey = key;
      this.k1 = [];
      this.k2 = [];

      const p10 = [3, 5, 2, 7, 4, 10, 1, 9, 8, 6];
      const p8 = [6, 3, 7, 4, 8, 5, 10, 9];

      const permutated = p10.map((index) => this.originalKey[index - 1]);
      const left = permutated.slice(0, 5);
      const right = permutated.slice(5, 10);
      const leftRotated = this.leftRotate(left);
      const rightRotated = this.leftRotate(right);

      this.generateK1(leftRotated, rightRotated);
      this.generateK2(leftRotated, rightRotated);
    }

    generateK1(left, right) {
      const joinedKey = [...left, ...right];
      this.k1 = p8.map((index) => joinedKey[index - 1]);
    }

    generateK2(left, right) {
      const leftRotated = this.leftRotate(this.leftRotate(left));
      const rightRotated = this.leftRotate(this.leftRotate(right));
      const joinedKey = [...leftRotated, ...rightRotated];
      this.k2 = p8.map((index) => joinedKey[index - 1]);
    }

    leftRotate(bits) {
      const newBits = [...bits];
      const firstBit = newBits.shift();
      newBits.push(firstBit);
      return newBits;
    }
  };

  static Crypt = class {
    constructor(originalKey, bits, operation) {
      this.keys = new DES.Key(originalKey);
      this.bits = bits;
      this.operation = operation;
    }

    execute() {
      if (this.operation === 'C') {
        return this.encrypt();
      }
      return this.decrypt();
    }

    encrypt() {
      const ip = [2, 6, 3, 1, 4, 8, 5, 7];
      const fp = [4, 1, 3, 5, 7, 2, 8, 6];
      const expand = [4, 1, 2, 3, 2, 3, 4, 1];
      const p4 = [2, 4, 3, 1];
      const s0 = [
        [1, 0, 3, 2],
        [3, 2, 1, 0],
        [0, 2, 1, 3],
        [3, 1, 3, 2],
      ];
      const s1 = [
        [1, 1, 2, 3],
        [2, 0, 1, 3],
        [3, 0, 1, 0],
        [2, 1, 0, 3],
      ];

      const permutated = ip.map((index) => this.bits[index - 1]);
      const left = permutated.slice(0, 4);
      const right = permutated.slice(4, 8);
      let result = this.fFunction(left, right, this.keys.k1);
      left.splice(0, left.length, ...result.slice(0, 4));
      right.splice(0, right.length, ...result.slice(4, 8));
      result = this.fFunction(right, left, this.keys.k2);

      const finalPermutation = new Array(8);
      for (let i = 0; i < 8; i++) {
        finalPermutation[i] = result[fp[i] - 1];
      }

      return finalPermutation;
    }

    decrypt() {
      const ip = [2, 6, 3, 1, 4, 8, 5, 7];
      const fp = [4, 1, 3, 5, 7, 2, 8, 6];
      const expand = [4, 1, 2, 3, 2, 3, 4, 1];
      const p4 = [2, 4, 3, 1];
      const s0 = [
        [1, 0, 3, 2],
        [3, 2, 1, 0],
        [0, 2, 1, 3],
        [3, 1, 3, 2],
      ];
      const s1 = [
        [1, 1, 2, 3],
        [2, 0, 1, 3],
        [3, 0, 1, 0],
        [2, 1, 0, 3],
      ];

      const permutated = ip.map((index) => this.bits[index - 1]);
      const left = permutated.slice(0, 4);
      const right = permutated.slice(4, 8);
      let result = this.fFunction(left, right, this.keys.k2);
      left.splice(0, left.length, ...result.slice(0, 4));
      right.splice(0, right.length, ...result.slice(4, 8));
      result = this.fFunction(right, left, this.keys.k1);

      const finalPermutation = new Array(8);
      for (let i = 0; i < 8; i++) {
        finalPermutation[i] = result[fp[i] - 1];
      }

      return finalPermutation;
    }

    fFunction(left, right, key) {
      const expand = [4, 1, 2, 3, 2, 3, 4, 1];
      const p4 = [2, 4, 3, 1];
      const s0 = [
        [1, 0, 3, 2],
        [3, 2, 1, 0],
        [0, 2, 1, 3],
        [3, 1, 3, 2],
      ];
      const s1 = [
        [1, 1, 2, 3],
        [2, 0, 1, 3],
        [3, 0, 1, 0],
        [2, 1, 0, 3],
      ];

      const expanded = expand.map((index) => right[index - 1]);
      const xOr = this.getXorBits(expanded, key);
      const subLeft = xOr.slice(0, 4);
      const subRight = xOr.slice(4, 8);
      const s0Output = this.sBox(subLeft, s0);
      const s1Output = this.sBox(subRight, s1);
      const joined = [...s0Output, ...s1Output];
      const permutated = p4.map((index) => joined[index - 1]);
      const newLeft = this.getXorBits(permutated, left);
      const finalBits = [...newLeft, ...right];

      return finalBits;
    }

    getXorBits(bits1, bits2) {
      const result = [];
      for (let i = 0; i < bits1.length; i++) {
        const k1_bit = bits1[i];
        const current_bit = bits2[i];
        const result_bit = k1_bit === current_bit ? 0 : 1;
        result.push(result_bit);
      }
      return result;
    }

    sBox(bits, matrix) {
      const row = this.binaryToDecimal(bits[0], bits[3]);
      const col = this.binaryToDecimal(bits[1], bits[2]);
      const binary = matrix[row][col];
      return this.decimalToBinary(binary);
    }

    binaryToDecimal(bit1, bit2) {
      if (bit1 === 1) {
        return bit2 === 1 ? 3 : 2;
      }
      return bit2 === 1 ? 1 : 0;
    }

    decimalToBinary(decimal) {
      let result = [];
      switch (decimal) {
        case 0:
          result = [0, 0];
          break;
        case 1:
          result = [0, 1];
          break;
        case 2:
          result = [1, 0];
          break;
        case 3:
          result = [1, 1];
          break;
      }
      return result;
    }
  }

  encrypt(bits) {
    return new Crypt(this.originalKey, bits, 'C').execute();
  }

  decrypt(bits) {
    return new Crypt(this.originalKey, bits, 'D').execute();
  }
}

const desInstance = new DES('1010000010');

const playText = 'testestetetete'

const encryptaddo = desInstance.encrypt(playText)

console.log('encryptaddo', encryptaddo)

const decryptaddo = desInstance.decrypt(encryptaddo)

console.log('decryptaddo', decryptaddo)
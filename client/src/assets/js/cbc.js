const DES = require('./des');

class CBC {
  constructor(key, IV) {
    this.N_BITS = 8;
    this.key = key;
    this.IV = IV;
  }

  xor(input1, input2) {
    const output = [];

    for (let i = 0; i < input1.length; i++) {
      output[i] = (input1[i] + input2[i]) % 2;
    }
    return output;
  }

  encrypt(plaintext) {
    const plaintext_array = plaintext.split('');
    const num = new Array(plaintext_array.length);

    // convert plaintext to int[] num
    for (let i = 0; i < plaintext_array.length; i++) {
      num[i] = plaintext_array[i].charCodeAt(0);
    }

    let stext = '';
    let temps;

    // expand each character in plaintext to 8 bits ASCII code
    for (let i = 0; i < num.length; i++) {
      const tem = num[i];
      temps = tem.toString(2);

      while (temps.length < 8) {
        temps = '0' + temps;
        if (temps.length < 8) {
          temps = '0' + temps;
        }
      }
      stext += temps;
    }

    if (stext.length < this.N_BITS) {
      throw new Error('Array size wrong');
    } else {
      // get the number of blocks
      const numofblock = Math.floor(stext.length / this.N_BITS);

      if (stext.length % this.N_BITS > 0) {
        // padding 0 to plaintext to have equal N_BITS bits blocks
        const n = this.N_BITS - (stext.length - this.N_BITS * numofblock);
        for (let i = 0; i < n; i++) {
          stext += '0';
        }
      }

      // store binary text in the int[]
      const text_result = new Array(stext.length);
      for (let i = 0; i < stext.length; i++) {
        text_result[i] = parseInt(stext.charAt(i));
      }

      // divide plaintext in every 8 bits blocks
      const blocks = new Array(numofblock);
      for (let i = 0; i < numofblock; i++) {
        blocks[i] = new Array(this.N_BITS);
        for (let j = 0; j < this.N_BITS; j++) {
          blocks[i][j] = text_result[j + i * this.N_BITS];
        }
      }

      const des = new DES(this.key);
      let cBits = this.IV;

      const ciphers = new Array(numofblock);
      for (let i = 0; i < numofblock; i++) {
        const bits = this.xor(blocks[i], cBits);
        const encrypted = des.encrypt(bits);
        cBits = encrypted;
        ciphers[i] = encrypted;
      }

      const finaltext = new Array(text_result.length);
      for (let i = 0; i < numofblock; i++) {
        for (let j = 0; j < this.N_BITS; j++) {
          finaltext[j + i * this.N_BITS] = ciphers[i][j];
        }
      }

      const numofdex = finaltext.length / this.N_BITS;
      let binarystring = '';
      const final_output = new Array(numofdex);

      for (let i = 0; i < numofdex; i++) {
        for (let j = i * this.N_BITS; j <= i * this.N_BITS + (this.N_BITS - 1); j++) {
          binarystring += finaltext[j];
        }

        let numtemp;
        numtemp = parseInt(binarystring, 2);
        final_output[i] = numtemp;
        binarystring = '';
      }

      let hexString = '';
      for (let i = 0; i < final_output.length; i++) {
        hexString += final_output[i].toString(16) + ':';
      }

      return hexString;
    }
  }

  decrypt(encryptedString) {
    const splitted = encryptedString.split(':');
    const decimals = new Array(splitted.length);

    // convert hexa to decimal
    for (let i = 0; i < decimals.length; i++) {
      decimals[i] = parseInt(splitted[i], 16);
    }

    let s = '';
    let temps;

    for (let i = 0; i < decimals.length; i++) {
      const tem = decimals[i];
      temps = tem.toString(2);

      while (temps.length < 8) {
        temps = '0' + temps;
        if (temps.length < 8) {
          temps = '0' + temps;
        }
      }
      s += temps;
    }

    if (s.length < this.N_BITS) {
      throw new Error('Array size wrong');
    } else {
      // get the number of blocks
      const numofblock = Math.floor(s.length / this.N_BITS);

      if (s.length % this.N_BITS > 0) {
        // padding 0 to plaintext to have equal N_BITS bits blocks
        const n = this.N_BITS - (s.length - this.N_BITS * numofblock);
        for (let i = 0; i < n; i++) {
          s += '0';
        }
      }

      // store binary text in the int[]
      const text_result = new Array(s.length);
      for (let i = 0; i < s.length; i++) {
        text_result[i] = parseInt(s.charAt(i));
      }

      const blocks = new Array(numofblock);
      for (let i = 0; i < numofblock; i++) {
        blocks[i] = new Array(this.N_BITS);
        for (let j = 0; j < this.N_BITS; j++) {
          blocks[i][j] = text_result[j + i * this.N_BITS];
        }
      }

      const des = new DES(this.key);
      let cBits = this.IV;

      const plaintext = new Array(numofblock);
      for (let i = 0; i < numofblock; i++) {
        const decrypted = des.decrypt(blocks[i]);
        const bits = this.xor(decrypted, cBits);
        cBits = blocks[i];
        plaintext[i] = bits;
      }

      const finaltext = new Array(text_result.length);
      for (let i = 0; i < numofblock; i++) {
        for (let j = 0; j < this.N_BITS; j++) {
          finaltext[j + i * this.N_BITS] = plaintext[i][j];
        }
      }

      const numofdex = finaltext.length / this.N_BITS;
      let binarystring = '';
      const final_output = new Array(numofdex);

      for (let i = 0; i < numofdex; i++) {
        for (let j = i * this.N_BITS; j <= i * this.N_BITS + (this.N_BITS - 1); j++) {
          binarystring += finaltext[j];
        }

        let numtemp;
        numtemp = parseInt(binarystring, 2);
        final_output[i] = numtemp;
        binarystring = '';
      }

      const charArray = new Array(final_output.length);
      for (let i = 0; i < final_output.length; i++) {
        charArray[i] = String.fromCharCode(final_output[i]);
      }

      return charArray.join('');
    }
  }
}

const key = [0, 1, 0, 1, 0, 0, 1, 1, 1, 0];
const IV = [0, 1, 1, 1, 0, 1, 0, 1, 1, 0];

const cbcInstance = new CBC(key, IV);

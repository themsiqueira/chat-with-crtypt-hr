import { DES } from './des'

export class ECB {
  constructor(key) {
    this.N_BITS = 8;
    this.key = key;
  }

  encrypt(plaintext) {
    const plaintextArray = plaintext.split("");
    const num = new Array(plaintextArray.length);

    for (let i = 0; i < plaintextArray.length; i++) {
      num[i] = plaintextArray[i].charCodeAt(0);
    }

    let s = "";
    let temps;

    for (let i = 0; i < num.length; i++) {
      const tem = num[i];
      temps = tem.toString(2);

      while (temps.length < 8) {
        temps = "0" + temps;
        if (temps.length < 8) temps = "0" + temps;
      }
      s += temps;
    }

    if (s.length < this.N_BITS) {
      throw new Error("Array size wrong");
    } else {
      const numofblock = Math.floor(s.length / this.N_BITS);

      if (s.length % this.N_BITS > 0) {
        const n = this.N_BITS - (s.length - this.N_BITS * numofblock);
        for (let i = 0; i < n; i++) {
          s += "0";
        }
      }

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

      const ciphers = new Array(numofblock);
      for (let i = 0; i < numofblock; i++) {
        ciphers[i] = des.encrypt(blocks[i]);
      }

      const finaltext = new Array(text_result.length);
      for (let i = 0; i < numofblock; i++) {
        for (let j = 0; j < this.N_BITS; j++) {
          finaltext[j + i * this.N_BITS] = ciphers[i][j];
        }
      }

      const numofdex = Math.floor(finaltext.length / this.N_BITS);
      let binarystring = "";
      const final_output = new Array(numofdex);

      for (let i = 0; i < numofdex; i++) {
        for (let j = i * this.N_BITS; j <= i * this.N_BITS + (this.N_BITS - 1); j++) {
          binarystring += finaltext[j];
        }

        let numtemp;
        numtemp = parseInt(binarystring, 2);
        final_output[i] = numtemp;
        binarystring = "";
      }

      let hexString = "";
      for (let i = 0; i < final_output.length; i++) {
        hexString += final_output[i].toString(16) + ":";
      }

      return hexString;
    }
  }

  decrypt(encryptedString) {
    const splitted = encryptedString.split(":");
    const decimals = new Array(splitted.length);

    for (let i = 0; i < decimals.length; i++) {
      decimals[i] = parseInt(splitted[i], 16);
    }

    let s = "";
    let temps;

    for (let i = 0; i < decimals.length; i++) {
      const tem = decimals[i];
      temps = tem.toString(2);

      while (temps.length < 8) {
        temps = "0" + temps;
        if (temps.length < 8) temps = "0" + temps;
      }
      s += temps;
    }

    if (s.length < this.N_BITS) {
      throw new Error("Array size wrong");
    } else {
      const numofblock = Math.floor(s.length / this.N_BITS);

      if (s.length % this.N_BITS > 0) {
        const n = this.N_BITS - (s.length - this.N_BITS * numofblock);
        for (let i = 0; i < n; i++) {
          s += "0";
        }
      }

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

      const plaintext = new Array(numofblock);
      for (let i = 0; i < numofblock; i++) {
        plaintext[i] = des.decrypt(blocks[i]);
      }

      const finaltext = new Array(text_result.length);
      for (let i = 0; i < numofblock; i++) {
        for (let j = 0; j < this.N_BITS; j++) {
          finaltext[j + i * this.N_BITS] = plaintext[i][j];
        }
      }

      const numofdex = Math.floor(finaltext.length / this.N_BITS);
      let binarystring = "";
      const final_output = new Array(numofdex);

      for (let i = 0; i < numofdex; i++) {
        for (let j = i * this.N_BITS; j <= i * this.N_BITS + (this.N_BITS - 1); j++) {
          binarystring += finaltext[j];
        }

        let numtemp;
        numtemp = parseInt(binarystring, 2);
        final_output[i] = numtemp;
        binarystring = "";
      }

      const charArray = new Array(final_output.length);
      for (let i = 0; i < final_output.length; i++) {
        charArray[i] = String.fromCharCode(final_output[i]);
      }

      return charArray.join("");
    }
  }
}


const ecbInstance = new ECB([1,0,0,0,0,0,0,0,0,0]);

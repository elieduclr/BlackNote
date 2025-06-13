// ChaCha20 Implementation in TypeScript
export class ChaCha20 {
  private static sigma = new Uint8Array([
    0x65, 0x78, 0x70, 0x61, 0x6e, 0x64, 0x20, 0x33,
    0x32, 0x2d, 0x62, 0x79, 0x74, 0x65, 0x20, 0x6b
  ]);

  private static quarterRound(x: Uint32Array, a: number, b: number, c: number, d: number): void {
    x[a] = (x[a] + x[b]) >>> 0;
    x[d] = this.rotl32(x[d] ^ x[a], 16);
    x[c] = (x[c] + x[d]) >>> 0;
    x[b] = this.rotl32(x[b] ^ x[c], 12);
    x[a] = (x[a] + x[b]) >>> 0;
    x[d] = this.rotl32(x[d] ^ x[a], 8);
    x[c] = (x[c] + x[d]) >>> 0;
    x[b] = this.rotl32(x[b] ^ x[c], 7);
  }

  private static rotl32(x: number, n: number): number {
    return ((x << n) | (x >>> (32 - n))) >>> 0;
  }

  private static core(key: Uint8Array, nonce: Uint8Array, counter: number): Uint8Array {
    const state = new Uint32Array(16);
    const keyWords = new Uint32Array(key.buffer, key.byteOffset, 8);
    const nonceWords = new Uint32Array(nonce.buffer, nonce.byteOffset, 3);

    // Initialize state
    for (let i = 0; i < 4; i++) {
      state[i] = new DataView(this.sigma.buffer).getUint32(i * 4, true);
    }
    for (let i = 0; i < 8; i++) {
      state[4 + i] = keyWords[i];
    }
    state[12] = counter;
    for (let i = 0; i < 3; i++) {
      state[13 + i] = nonceWords[i];
    }

    const working = new Uint32Array(state);

    // 20 rounds
    for (let i = 0; i < 10; i++) {
      this.quarterRound(working, 0, 4, 8, 12);
      this.quarterRound(working, 1, 5, 9, 13);
      this.quarterRound(working, 2, 6, 10, 14);
      this.quarterRound(working, 3, 7, 11, 15);
      this.quarterRound(working, 0, 5, 10, 15);
      this.quarterRound(working, 1, 6, 11, 12);
      this.quarterRound(working, 2, 7, 8, 13);
      this.quarterRound(working, 3, 4, 9, 14);
    }

    // Add original state
    for (let i = 0; i < 16; i++) {
      working[i] = (working[i] + state[i]) >>> 0;
    }

    const output = new Uint8Array(64);
    for (let i = 0; i < 16; i++) {
      new DataView(output.buffer).setUint32(i * 4, working[i], true);
    }

    return output;
  }

  static encrypt(plaintext: Uint8Array, key: Uint8Array, nonce: Uint8Array): Uint8Array {
    const ciphertext = new Uint8Array(plaintext.length);
    let counter = 1;

    for (let i = 0; i < plaintext.length; i += 64) {
      const keystream = this.core(key, nonce, counter++);
      const chunkSize = Math.min(64, plaintext.length - i);

      for (let j = 0; j < chunkSize; j++) {
        ciphertext[i + j] = plaintext[i + j] ^ keystream[j];
      }
    }

    return ciphertext;
  }

  static decrypt(ciphertext: Uint8Array, key: Uint8Array, nonce: Uint8Array): Uint8Array {
    return this.encrypt(ciphertext, key, nonce);
  }
}
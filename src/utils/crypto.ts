import { ChaCha20 } from './chacha20';
import type { CryptoComponents } from '../types';

export class BlackNoteCrypto {
  private static readonly PBKDF2_ITERATIONS = 100000;
  private static readonly OBFUSCATION_CHARS = ['§', '¢', '€', '¥', '£', '₹', '₽', '₩', '₪', '₫'];

  // Generate cryptographically secure random bytes
  private static generateRandomBytes(length: number): Uint8Array {
    return crypto.getRandomValues(new Uint8Array(length));
  }

  // Convert string to UTF-8 bytes
  private static stringToBytes(str: string): Uint8Array {
    return new TextEncoder().encode(str);
  }

  // Convert bytes to string
  private static bytesToString(bytes: Uint8Array): string {
    return new TextDecoder().decode(bytes);
  }

  // Convert bytes to hex string
  private static bytesToHex(bytes: Uint8Array): string {
    return Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  // Convert hex string to bytes
  private static hexToBytes(hex: string): Uint8Array {
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < hex.length; i += 2) {
      bytes[i / 2] = parseInt(hex.slice(i, i + 2), 16);
    }
    return bytes;
  }

  // Derive key using PBKDF2
  private static async deriveKey(password: string, salt: Uint8Array, keyUsage: string): Promise<Uint8Array> {
    const passwordBytes = this.stringToBytes(password + keyUsage);
    const importedKey = await crypto.subtle.importKey(
      'raw',
      passwordBytes,
      { name: 'PBKDF2' },
      false,
      ['deriveBits']
    );

    const derivedBits = await crypto.subtle.deriveBits(
      {
        name: 'PBKDF2',
        salt: salt,
        iterations: this.PBKDF2_ITERATIONS,
        hash: 'SHA-256'
      },
      importedKey,
      256
    );

    return new Uint8Array(derivedBits);
  }

  // Apply dynamic obfuscation
  private static obfuscateData(data: Uint8Array, seed: string): string {
    const dataHex = this.bytesToHex(data);
    let result = '';
    let seedIndex = 0;

    for (let i = 0; i < dataHex.length; i++) {
      result += dataHex[i];
      
      // Insert obfuscation character based on seed
      const seedChar = seed.charCodeAt(seedIndex % seed.length);
      if ((seedChar + i) % 7 === 0) {
        const obfuscationChar = this.OBFUSCATION_CHARS[seedChar % this.OBFUSCATION_CHARS.length];
        result += obfuscationChar;
      }
      seedIndex++;
    }

    return result;
  }

  // Remove dynamic obfuscation
  private static deobfuscateData(obfuscatedHex: string, seed: string): Uint8Array {
    let cleanHex = '';
    let seedIndex = 0;
    let originalIndex = 0;

    for (let i = 0; i < obfuscatedHex.length; i++) {
      const char = obfuscatedHex[i];
      
      if (this.OBFUSCATION_CHARS.includes(char)) {
        // Skip obfuscation character
        continue;
      }
      
      cleanHex += char;
      
      // Check if we should have an obfuscation char after this position
      const seedChar = seed.charCodeAt(seedIndex % seed.length);
      if ((seedChar + originalIndex) % 7 === 0 && i + 1 < obfuscatedHex.length) {
        i++; // Skip the expected obfuscation character
      }
      
      seedIndex++;
      originalIndex++;
    }

    return this.hexToBytes(cleanHex);
  }

  // Calculate HMAC-SHA256
  private static async calculateHMAC(data: Uint8Array, key: Uint8Array): Promise<string> {
    const importedKey = await crypto.subtle.importKey(
      'raw',
      key,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );

    const signature = await crypto.subtle.sign('HMAC', importedKey, data);
    return this.bytesToHex(new Uint8Array(signature));
  }

  // Verify HMAC-SHA256
  private static async verifyHMAC(data: Uint8Array, key: Uint8Array, expectedHmac: string): Promise<boolean> {
    const calculatedHmac = await this.calculateHMAC(data, key);
    return calculatedHmac === expectedHmac;
  }

  // Main encryption function using Double Lock & Obfuscate
  static async encrypt(plaintext: string, password: string): Promise<string> {
    try {
      // Generate random salts and obfuscation seed
      const salt1 = this.generateRandomBytes(32);
      const salt2 = this.generateRandomBytes(32);
      const obfuscationSeed = this.bytesToHex(this.generateRandomBytes(16));

      // Derive keys
      const key1 = await this.deriveKey(password, salt1, 'CHACHA20');
      const key2 = await this.deriveKey(password, salt2, 'AES-GCM');
      const keyIntegrity = await this.deriveKey(password, salt1, 'INTEGRITY');

      // Step 1: ChaCha20 encryption
      const plaintextBytes = this.stringToBytes(plaintext);
      const nonce = this.generateRandomBytes(12);
      const chachaEncrypted = ChaCha20.encrypt(plaintextBytes, key1, nonce);

      // Step 2: Calculate HMAC for integrity
      const hmac = await this.calculateHMAC(chachaEncrypted, keyIntegrity);

      // Step 3: Dynamic obfuscation
      const obfuscatedData = this.obfuscateData(chachaEncrypted, obfuscationSeed);
      const obfuscatedBytes = this.stringToBytes(obfuscatedData);

      // Step 4: AES-256-GCM encryption
      const aesKey = await crypto.subtle.importKey(
        'raw',
        key2,
        { name: 'AES-GCM' },
        false,
        ['encrypt']
      );

      const aesIv = this.generateRandomBytes(12);
      const aesEncrypted = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv: aesIv },
        aesKey,
        obfuscatedBytes
      );

      // Step 5: Assemble final encrypted data
      const components: CryptoComponents = {
        salt1: this.bytesToHex(salt1),
        salt2: this.bytesToHex(salt2),
        obfuscationSeed,
        hmac,
        ciphertext: this.bytesToHex(nonce) + '|' + this.bytesToHex(aesIv) + '|' + this.bytesToHex(new Uint8Array(aesEncrypted))
      };

      return JSON.stringify(components);
    } catch (error) {
      throw new Error('Encryption failed: ' + (error as Error).message);
    }
  }

  // Main decryption function
  static async decrypt(encryptedData: string, password: string): Promise<string> {
    try {
      const components: CryptoComponents = JSON.parse(encryptedData);
      const { salt1, salt2, obfuscationSeed, hmac, ciphertext } = components;

      // Parse ciphertext components
      const [nonceHex, aesIvHex, aesDataHex] = ciphertext.split('|');
      const nonce = this.hexToBytes(nonceHex);
      const aesIv = this.hexToBytes(aesIvHex);
      const aesData = this.hexToBytes(aesDataHex);

      // Derive keys
      const key1 = await this.deriveKey(password, this.hexToBytes(salt1), 'CHACHA20');
      const key2 = await this.deriveKey(password, this.hexToBytes(salt2), 'AES-GCM');
      const keyIntegrity = await this.deriveKey(password, this.hexToBytes(salt1), 'INTEGRITY');

      // Step 1: AES-256-GCM decryption
      const aesKey = await crypto.subtle.importKey(
        'raw',
        key2,
        { name: 'AES-GCM' },
        false,
        ['decrypt']
      );

      const aesDecrypted = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv: aesIv },
        aesKey,
        aesData
      );

      // Step 2: De-obfuscation
      const obfuscatedData = this.bytesToString(new Uint8Array(aesDecrypted));
      const chachaEncrypted = this.deobfuscateData(obfuscatedData, obfuscationSeed);

      // Step 3: Verify HMAC integrity
      const isValid = await this.verifyHMAC(chachaEncrypted, keyIntegrity, hmac);
      if (!isValid) {
        throw new Error('Data integrity check failed. The data may have been tampered with.');
      }

      // Step 4: ChaCha20 decryption
      const plaintextBytes = ChaCha20.decrypt(chachaEncrypted, key1, nonce);
      return this.bytesToString(plaintextBytes);
    } catch (error) {
      throw new Error('Decryption failed: ' + (error as Error).message);
    }
  }
}
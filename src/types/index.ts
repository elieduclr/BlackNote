export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
  tags: string[];
}

export interface EncryptedNote {
  id: string;
  encryptedData: string;
  createdAt: number;
  updatedAt: number;
}

export interface CryptoComponents {
  salt1: string;
  salt2: string;
  obfuscationSeed: string;
  hmac: string;
  ciphertext: string;
}

export interface BackupData {
  version: string;
  timestamp: number;
  notes: EncryptedNote[];
}
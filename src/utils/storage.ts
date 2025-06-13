import type { Note, EncryptedNote, BackupData } from '../types';
import { BlackNoteCrypto } from './crypto';

export class BlackNoteStorage {
  private static readonly STORAGE_KEY = 'blacknote_encrypted_notes';
  private static readonly VERSION = '1.0.0';

  // Save encrypted notes to localStorage
  static saveNotes(notes: EncryptedNote[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(notes));
    } catch (error) {
      throw new Error('Failed to save notes to local storage');
    }
  }

  // Load encrypted notes from localStorage
  static loadNotes(): EncryptedNote[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to load notes from local storage:', error);
      return [];
    }
  }

  // Encrypt and save a note
  static async saveNote(note: Note, password: string): Promise<void> {
    try {
      const noteData = JSON.stringify({
        title: note.title,
        content: note.content,
        tags: note.tags
      });

      const encryptedData = await BlackNoteCrypto.encrypt(noteData, password);
      
      const encryptedNote: EncryptedNote = {
        id: note.id,
        encryptedData,
        createdAt: note.createdAt,
        updatedAt: note.updatedAt
      };

      const notes = this.loadNotes();
      const existingIndex = notes.findIndex(n => n.id === note.id);
      
      if (existingIndex >= 0) {
        notes[existingIndex] = encryptedNote;
      } else {
        notes.push(encryptedNote);
      }

      this.saveNotes(notes);
    } catch (error) {
      throw new Error('Failed to save note: ' + (error as Error).message);
    }
  }

  // Load and decrypt a note
  static async loadNote(id: string, password: string): Promise<Note | null> {
    try {
      const notes = this.loadNotes();
      const encryptedNote = notes.find(n => n.id === id);
      
      if (!encryptedNote) {
        return null;
      }

      const decryptedData = await BlackNoteCrypto.decrypt(encryptedNote.encryptedData, password);
      const noteData = JSON.parse(decryptedData);

      return {
        id: encryptedNote.id,
        title: noteData.title,
        content: noteData.content,
        tags: noteData.tags,
        createdAt: encryptedNote.createdAt,
        updatedAt: encryptedNote.updatedAt
      };
    } catch (error) {
      throw new Error('Failed to load note: ' + (error as Error).message);
    }
  }

  // Load all notes (metadata only)
  static loadNotesMetadata(): { id: string; createdAt: number; updatedAt: number }[] {
    const notes = this.loadNotes();
    return notes.map(note => ({
      id: note.id,
      createdAt: note.createdAt,
      updatedAt: note.updatedAt
    }));
  }

  // Delete a note
  static deleteNote(id: string): void {
    try {
      const notes = this.loadNotes();
      const filteredNotes = notes.filter(n => n.id !== id);
      this.saveNotes(filteredNotes);
    } catch (error) {
      throw new Error('Failed to delete note');
    }
  }

  // Export backup
  static exportBackup(): string {
    const notes = this.loadNotes();
    const backup: BackupData = {
      version: this.VERSION,
      timestamp: Date.now(),
      notes
    };
    return JSON.stringify(backup);
  }

  // Import backup
  static importBackup(backupData: string): void {
    try {
      const backup: BackupData = JSON.parse(backupData);
      
      if (!backup.version || !backup.notes) {
        throw new Error('Invalid backup format');
      }

      // Merge with existing notes (keep newer versions)
      const existingNotes = this.loadNotes();
      const existingMap = new Map(existingNotes.map(note => [note.id, note]));
      
      backup.notes.forEach(importedNote => {
        const existing = existingMap.get(importedNote.id);
        if (!existing || importedNote.updatedAt > existing.updatedAt) {
          existingMap.set(importedNote.id, importedNote);
        }
      });

      const mergedNotes = Array.from(existingMap.values());
      this.saveNotes(mergedNotes);
    } catch (error) {
      throw new Error('Failed to import backup: ' + (error as Error).message);
    }
  }

  // Clear all data
  static clearAllData(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}
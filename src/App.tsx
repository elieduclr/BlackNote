import React, { useState, useEffect, useRef } from 'react';
import { MasterPasswordModal } from './components/MasterPasswordModal';
import { Header } from './components/Header';
import { NoteCard } from './components/NoteCard';
import { NoteEditor } from './components/NoteEditor';
import { EmptyState } from './components/EmptyState';
import { BlackNoteStorage } from './utils/storage';
import type { Note } from './types';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [masterPassword, setMasterPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [notes, setNotes] = useState<Note[]>([]);
  const [notesMetadata, setNotesMetadata] = useState<Array<{ id: string; createdAt: number; updatedAt: number }>>([]);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load notes metadata on authentication
  useEffect(() => {
    if (isAuthenticated) {
      loadNotesMetadata();
    }
  }, [isAuthenticated]);

  const handlePasswordSubmit = async (password: string) => {
    setIsLoading(true);
    setAuthError('');
    
    try {
      // Try to decrypt the first note to verify password
      const metadata = BlackNoteStorage.loadNotesMetadata();
      if (metadata.length > 0) {
        try {
          await BlackNoteStorage.loadNote(metadata[0].id, password);
        } catch (error) {
          setAuthError('Invalid master password');
          setIsLoading(false);
          return;
        }
      }
      
      setMasterPassword(password);
      setIsAuthenticated(true);
    } catch (error) {
      setAuthError('Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const loadNotesMetadata = () => {
    const metadata = BlackNoteStorage.loadNotesMetadata();
    setNotesMetadata(metadata.sort((a, b) => b.updatedAt - a.updatedAt));
  };

  const loadNote = async (id: string): Promise<Note | null> => {
    try {
      return await BlackNoteStorage.loadNote(id, masterPassword);
    } catch (error) {
      console.error('Failed to load note:', error);
      return null;
    }
  };

  const handleNewNote = () => {
    setEditingNote(undefined);
    setIsEditorOpen(true);
  };

  const handleEditNote = async (id: string) => {
    const note = await loadNote(id);
    if (note) {
      setEditingNote(note);
      setIsEditorOpen(true);
    }
  };

  const handleSaveNote = async (noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const now = Date.now();
      const note: Note = {
        id: editingNote?.id || crypto.randomUUID(),
        ...noteData,
        createdAt: editingNote?.createdAt || now,
        updatedAt: now
      };

      await BlackNoteStorage.saveNote(note, masterPassword);
      loadNotesMetadata();
      setIsEditorOpen(false);
      setEditingNote(undefined);
    } catch (error) {
      console.error('Failed to save note:', error);
    }
  };

  const handleDeleteNote = async (id: string) => {
    if (confirm('Are you sure you want to delete this note? This action cannot be undone.')) {
      try {
        BlackNoteStorage.deleteNote(id);
        loadNotesMetadata();
        setNotes(notes.filter(note => note.id !== id));
      } catch (error) {
        console.error('Failed to delete note:', error);
      }
    }
  };

  const handleExport = () => {
    try {
      const backup = BlackNoteStorage.exportBackup();
      const blob = new Blob([backup], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `blacknote-backup-${new Date().toISOString().split('T')[0]}.blacknote`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export backup:', error);
      alert('Failed to export backup');
    }
  };

  const handleImport = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const backup = e.target?.result as string;
        BlackNoteStorage.importBackup(backup);
        loadNotesMetadata();
        alert('Backup imported successfully!');
      } catch (error) {
        console.error('Failed to import backup:', error);
        alert('Failed to import backup. Please check the file format.');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout? You will need to enter your master password again.')) {
      setIsAuthenticated(false);
      setMasterPassword('');
      setNotes([]);
      setNotesMetadata([]);
      setIsEditorOpen(false);
      setEditingNote(undefined);
    }
  };

  // Load visible notes when metadata changes
  useEffect(() => {
    const loadVisibleNotes = async () => {
      if (!isAuthenticated || notesMetadata.length === 0) return;
      
      const loadedNotes: Note[] = [];
      for (const metadata of notesMetadata.slice(0, 20)) { // Load first 20 notes
        const note = await loadNote(metadata.id);
        if (note) {
          loadedNotes.push(note);
        }
      }
      setNotes(loadedNotes);
    };

    loadVisibleNotes();
  }, [notesMetadata, isAuthenticated]);

  return (
    <div className="min-h-screen bg-slate-900">
      <MasterPasswordModal
        isOpen={!isAuthenticated}
        onPasswordSubmit={handlePasswordSubmit}
        error={authError}
      />

      {isAuthenticated && (
        <>
          <Header
            onNewNote={handleNewNote}
            onExport={handleExport}
            onImport={handleImport}
            onLogout={handleLogout}
            noteCount={notesMetadata.length}
          />

          <main className="container mx-auto px-6 py-8">
            {notesMetadata.length === 0 ? (
              <EmptyState onNewNote={handleNewNote} />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {notes.map((note) => (
                  <NoteCard
                    key={note.id}
                    {...note}
                    onEdit={handleEditNote}
                    onDelete={handleDeleteNote}
                  />
                ))}
              </div>
            )}
          </main>

          <NoteEditor
            note={editingNote}
            isOpen={isEditorOpen}
            onSave={handleSaveNote}
            onCancel={() => {
              setIsEditorOpen(false);
              setEditingNote(undefined);
            }}
          />

          <input
            ref={fileInputRef}
            type="file"
            accept=".blacknote,.json"
            onChange={handleFileSelect}
            className="hidden"
          />
        </>
      )}
    </div>
  );
}

export default App;
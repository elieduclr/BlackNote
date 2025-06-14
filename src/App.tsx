import React, { useState, useEffect, useRef } from 'react';
import { MasterPasswordModal } from './components/MasterPasswordModal';
import { Header } from './components/Header';
import { NoteCard } from './components/NoteCard';
import { NoteEditor } from './components/NoteEditor';
import { EmptyState } from './components/EmptyState';
import { SearchBar } from './components/SearchBar';
import { TagFilter } from './components/TagFilter';
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
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
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
      setSearchQuery('');
      setSelectedTags([]);
    }
  };

  // Load visible notes when metadata changes
  useEffect(() => {
    const loadVisibleNotes = async () => {
      if (!isAuthenticated || notesMetadata.length === 0) return;
      
      const loadedNotes: Note[] = [];
      for (const metadata of notesMetadata.slice(0, 50)) {
        const note = await loadNote(metadata.id);
        if (note) {
          loadedNotes.push(note);
        }
      }
      setNotes(loadedNotes);
      
      // Extract all unique tags
      const tags = new Set<string>();
      loadedNotes.forEach(note => {
        note.tags.forEach(tag => tags.add(tag));
      });
      setAllTags(Array.from(tags).sort());
    };

    loadVisibleNotes();
  }, [notesMetadata, isAuthenticated]);

  // Filter notes based on search and tags
  const filteredNotes = notes.filter(note => {
    const matchesSearch = searchQuery === '' || 
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTags = selectedTags.length === 0 ||
      selectedTags.every(tag => note.tags.includes(tag));
    
    return matchesSearch && matchesTags;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <MasterPasswordModal
        isOpen={!isAuthenticated}
        onPasswordSubmit={handlePasswordSubmit}
        error={authError}
        isLoading={isLoading}
      />

      {isAuthenticated && (
        <>
          <Header
            onNewNote={handleNewNote}
            onExport={handleExport}
            onImport={handleImport}
            onLogout={handleLogout}
            noteCount={notesMetadata.length}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />

          <main className="container mx-auto px-4 sm:px-6 py-6">
            {notesMetadata.length === 0 ? (
              <EmptyState onNewNote={handleNewNote} />
            ) : (
              <div className="space-y-6">
                {/* Search and Filter Section */}
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex-1">
                    <SearchBar
                      value={searchQuery}
                      onChange={setSearchQuery}
                      placeholder="Search notes by title or content..."
                    />
                  </div>
                  <div className="lg:w-80">
                    <TagFilter
                      allTags={allTags}
                      selectedTags={selectedTags}
                      onTagsChange={setSelectedTags}
                    />
                  </div>
                </div>

                {/* Results Summary */}
                <div className="flex items-center justify-between text-sm text-slate-400">
                  <span>
                    {filteredNotes.length} of {notes.length} notes
                    {searchQuery && ` matching "${searchQuery}"`}
                    {selectedTags.length > 0 && ` with tags: ${selectedTags.join(', ')}`}
                  </span>
                </div>

                {/* Notes Grid/List */}
                {filteredNotes.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-slate-400 text-lg mb-2">No notes found</div>
                    <div className="text-slate-500 text-sm">
                      {searchQuery || selectedTags.length > 0 
                        ? 'Try adjusting your search or filters'
                        : 'Create your first note to get started'
                      }
                    </div>
                  </div>
                ) : (
                  <div className={
                    viewMode === 'grid' 
                      ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                      : "space-y-4"
                  }>
                    {filteredNotes.map((note, index) => (
                      <NoteCard
                        key={note.id}
                        {...note}
                        onEdit={handleEditNote}
                        onDelete={handleDeleteNote}
                        viewMode={viewMode}
                        animationDelay={index * 50}
                      />
                    ))}
                  </div>
                )}
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
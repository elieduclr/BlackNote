import React, { useState, useEffect, useRef } from 'react';
import { Save, X, Tags, Lock, FileText, Hash, Sparkles } from 'lucide-react';
import type { Note } from '../types';

interface NoteEditorProps {
  note?: Note;
  onSave: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
  isOpen: boolean;
}

export function NoteEditor({ note, onSave, onCancel, isOpen }: NoteEditorProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const contentTextareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setTags(note.tags);
      setTagInput('');
    } else {
      setTitle('');
      setContent('');
      setTags([]);
      setTagInput('');
    }
  }, [note]);

  useEffect(() => {
    if (isOpen && titleInputRef.current) {
      setTimeout(() => titleInputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    const words = content.trim().split(/\s+/).filter(word => word.length > 0).length;
    setWordCount(content.trim() === '' ? 0 : words);
    setCharCount(content.length);
  }, [content]);

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim().toLowerCase();
      if (!tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave({
        title: title.trim() || 'Untitled Note',
        content: content.trim(),
        tags
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onCancel();
    } else if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      handleSave();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" onKeyDown={handleKeyDown}>
      <div className="bg-slate-800/95 backdrop-blur-xl rounded-2xl w-full max-w-5xl max-h-[95vh] overflow-hidden shadow-2xl border border-slate-700/50">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700/50 bg-slate-900/50">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="p-3 bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-600 rounded-xl shadow-lg">
                <Lock className="w-6 h-6 text-white" />
              </div>
              <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-cyan-400 animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">
                {note ? 'Edit Note' : 'New Note'}
              </h2>
              <p className="text-sm text-slate-400">
                {wordCount} words • {charCount} characters
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="hidden sm:flex items-center space-x-2 text-xs text-slate-400 bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-700/50">
              <span>Ctrl+S to save</span>
              <span>•</span>
              <span>Esc to cancel</span>
            </div>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-600 hover:via-blue-700 hover:to-purple-700 disabled:from-slate-600 disabled:to-slate-700 text-white font-medium rounded-xl transition-all duration-200 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save</span>
                </>
              )}
            </button>
            <button
              onClick={onCancel}
              className="p-2.5 text-slate-400 hover:text-slate-300 hover:bg-slate-700/50 rounded-xl transition-all duration-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto max-h-[calc(95vh-120px)]">
          <div className="p-6 space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="flex items-center space-x-2 text-sm font-medium text-slate-300 mb-3">
                <FileText className="w-4 h-4 text-cyan-400" />
                <span>Title</span>
              </label>
              <input
                ref={titleInputRef}
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all duration-200 text-lg font-medium backdrop-blur-sm"
                placeholder="Enter note title..."
              />
            </div>

            {/* Tags */}
            <div>
              <label htmlFor="tags" className="flex items-center space-x-2 text-sm font-medium text-slate-300 mb-3">
                <Hash className="w-4 h-4 text-cyan-400" />
                <span>Tags</span>
              </label>
              <input
                id="tags"
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all duration-200 backdrop-blur-sm"
                placeholder="Type a tag and press Enter..."
              />
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center space-x-2 px-3 py-1.5 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 text-cyan-300 text-sm rounded-lg border border-cyan-500/30 backdrop-blur-sm"
                    >
                      <Tags className="w-3 h-3" />
                      <span>{tag}</span>
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="text-cyan-400 hover:text-red-400 ml-1 transition-colors duration-200"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Content */}
            <div>
              <label htmlFor="content" className="flex items-center space-x-2 text-sm font-medium text-slate-300 mb-3">
                <FileText className="w-4 h-4 text-cyan-400" />
                <span>Content</span>
              </label>
              <textarea
                ref={contentTextareaRef}
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={16}
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all duration-200 resize-none leading-relaxed backdrop-blur-sm"
                placeholder="Write your note content here..."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
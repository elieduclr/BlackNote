import React, { useState, useEffect, useRef } from 'react';
import { Save, X, Tags, Lock, FileText, Hash, Sparkles, Maximize2, Minimize2 } from 'lucide-react';
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
  const [isFullscreen, setIsFullscreen] = useState(false);
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
    if (e.key === 'Escape' && !isFullscreen) {
      onCancel();
    } else if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      handleSave();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className={`fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 ${
        isFullscreen ? 'p-0' : 'p-2 sm:p-4'
      }`} 
      onKeyDown={handleKeyDown}
    >
      <div className={`bg-slate-800/95 backdrop-blur-xl rounded-none sm:rounded-2xl w-full shadow-2xl border border-slate-700/50 overflow-hidden ${
        isFullscreen 
          ? 'h-full max-w-none max-h-none' 
          : 'max-w-6xl max-h-[95vh] sm:max-h-[90vh]'
      }`}>
        {/* Header - Responsive */}
        <div className="flex items-center justify-between p-3 sm:p-4 lg:p-6 border-b border-slate-700/50 bg-slate-900/50">
          <div className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-1">
            <div className="relative flex-shrink-0">
              <div className="p-2 sm:p-3 bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-600 rounded-lg sm:rounded-xl shadow-lg">
                <Lock className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
              </div>
              <Sparkles className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-3 h-3 sm:w-4 sm:h-4 text-cyan-400 animate-pulse" />
            </div>
            <div className="min-w-0">
              <h2 className="text-lg sm:text-xl font-semibold text-white truncate">
                {note ? 'Edit Note' : 'New Note'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                {wordCount} words • {charCount} characters
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
            {/* Keyboard shortcuts - Hidden on mobile */}
            <div className="hidden lg:flex items-center space-x-2 text-xs text-slate-400 bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-700/50">
              <span>Ctrl+S to save</span>
              <span>•</span>
              <span>Esc to cancel</span>
            </div>
            
            {/* Fullscreen toggle - Hidden on mobile */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="hidden sm:flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 text-slate-400 hover:text-slate-300 hover:bg-slate-700/50 rounded-lg transition-all duration-200"
              title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4 sm:w-5 sm:h-5" /> : <Maximize2 className="w-4 h-4 sm:w-5 sm:h-5" />}
            </button>
            
            {/* Save button */}
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center space-x-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-600 hover:via-blue-700 hover:to-purple-700 disabled:from-slate-600 disabled:to-slate-700 text-white font-medium rounded-lg sm:rounded-xl transition-all duration-200 disabled:cursor-not-allowed shadow-lg hover:shadow-xl text-sm sm:text-base"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span className="hidden sm:inline">Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span className="hidden sm:inline">Save</span>
                </>
              )}
            </button>
            
            {/* Close button */}
            <button
              onClick={onCancel}
              className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 text-slate-400 hover:text-slate-300 hover:bg-slate-700/50 rounded-lg transition-all duration-200"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Content - Responsive */}
        <div className={`overflow-y-auto ${
          isFullscreen 
            ? 'h-[calc(100vh-80px)]' 
            : 'max-h-[calc(95vh-120px)] sm:max-h-[calc(90vh-120px)]'
        }`}>
          <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
            {/* Title - Responsive */}
            <div>
              <label htmlFor="title" className="flex items-center space-x-2 text-sm font-medium text-slate-300 mb-2 sm:mb-3">
                <FileText className="w-4 h-4 text-cyan-400" />
                <span>Title</span>
              </label>
              <input
                ref={titleInputRef}
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-slate-900/50 border border-slate-600/50 rounded-lg sm:rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all duration-200 text-base sm:text-lg font-medium backdrop-blur-sm"
                placeholder="Enter note title..."
              />
            </div>

            {/* Tags - Responsive */}
            <div>
              <label htmlFor="tags" className="flex items-center space-x-2 text-sm font-medium text-slate-300 mb-2 sm:mb-3">
                <Hash className="w-4 h-4 text-cyan-400" />
                <span>Tags</span>
              </label>
              <input
                id="tags"
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-slate-900/50 border border-slate-600/50 rounded-lg sm:rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all duration-200 backdrop-blur-sm"
                placeholder="Type a tag and press Enter..."
              />
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2 sm:mt-3">
                  {tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center space-x-2 px-2 sm:px-3 py-1 sm:py-1.5 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 text-cyan-300 text-xs sm:text-sm rounded-md sm:rounded-lg border border-cyan-500/30 backdrop-blur-sm"
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

            {/* Content - Responsive */}
            <div>
              <label htmlFor="content" className="flex items-center space-x-2 text-sm font-medium text-slate-300 mb-2 sm:mb-3">
                <FileText className="w-4 h-4 text-cyan-400" />
                <span>Content</span>
              </label>
              <textarea
                ref={contentTextareaRef}
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={isFullscreen ? 25 : 12}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-slate-900/50 border border-slate-600/50 rounded-lg sm:rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all duration-200 resize-none leading-relaxed backdrop-blur-sm text-sm sm:text-base"
                placeholder="Write your note content here..."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
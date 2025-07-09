import React from 'react';
import { X, Edit3, Calendar, Tags, FileText, Clock, Sparkles } from 'lucide-react';
import { MarkdownPreview } from './MarkdownPreview';
import type { Note } from '../types';

interface NoteViewerProps {
  note?: Note;
  isOpen: boolean;
  onEdit: (id: string) => void;
  onClose: () => void;
}

export function NoteViewer({ note, isOpen, onEdit, onClose }: NoteViewerProps) {
  const [previewVisible, setPreviewVisible] = React.useState(true);

  if (!isOpen || !note) return null;

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getWordCount = (text: string) => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'e' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      onEdit(note.id);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4"
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div className="bg-slate-800/95 backdrop-blur-xl rounded-none sm:rounded-2xl w-full max-w-5xl max-h-[95vh] sm:max-h-[90vh] shadow-2xl border border-slate-700/50 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-3 sm:p-4 lg:p-6 border-b border-slate-700/50 bg-slate-900/50">
          <div className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-1">
            <div className="relative flex-shrink-0">
              <div className="p-2 sm:p-3 bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-600 rounded-lg sm:rounded-xl shadow-lg">
                <FileText className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
              </div>
              <Sparkles className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-3 h-3 sm:w-4 sm:h-4 text-cyan-400 animate-pulse" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-white truncate mb-1">
                {note.title || 'Untitled Note'}
              </h1>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-slate-400">
                <div className="flex items-center space-x-1">
                  <FileText className="w-3 h-3" />
                  <span>{getWordCount(note.content)} words</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="w-3 h-3" />
                  <span>Created {formatDate(note.createdAt)}</span>
                </div>
                {note.updatedAt !== note.createdAt && (
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>Updated {formatDate(note.updatedAt)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
            {/* Keyboard shortcuts - Hidden on mobile */}
            <div className="hidden lg:flex items-center space-x-2 text-xs text-slate-400 bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-700/50">
              <span>Ctrl+E to edit</span>
              <span>•</span>
              <span>Esc to close</span>
            </div>
            
            {/* Edit button */}
            <button
              onClick={() => onEdit(note.id)}
              className="flex items-center space-x-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-600 hover:via-blue-700 hover:to-purple-700 text-white font-medium rounded-lg sm:rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl text-sm sm:text-base"
            >
              <Edit3 className="w-4 h-4" />
              <span className="hidden sm:inline">Edit</span>
            </button>
            
            {/* Close button */}
            <button
              onClick={onClose}
              className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 text-slate-400 hover:text-slate-300 hover:bg-slate-700/50 rounded-lg transition-all duration-200"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Tags */}
        {note.tags.length > 0 && (
          <div className="p-3 sm:p-4 lg:p-6 border-b border-slate-700/50 bg-slate-800/30">
            <div className="flex items-center space-x-2 mb-3">
              <Tags className="w-4 h-4 text-cyan-400" />
              <span className="text-sm font-medium text-slate-300">Tags</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {note.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center space-x-1.5 px-2 sm:px-3 py-1 sm:py-1.5 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 text-cyan-300 text-xs sm:text-sm rounded-md sm:rounded-lg border border-cyan-500/30 backdrop-blur-sm"
                >
                  <Tags className="w-3 h-3" />
                  <span>{tag}</span>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          <div className="h-[calc(95vh-200px)] sm:h-[calc(90vh-200px)]">
            <MarkdownPreview
              content={note.content}
              isVisible={previewVisible}
              onToggle={() => setPreviewVisible(!previewVisible)}
              className="h-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
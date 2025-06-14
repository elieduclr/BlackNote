import React from 'react';
import { Calendar, Edit3, Trash2, Tags, Clock, FileText } from 'lucide-react';

interface NoteCardProps {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: number;
  updatedAt: number;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  viewMode: 'grid' | 'list';
  animationDelay?: number;
}

export function NoteCard({ 
  id, 
  title, 
  content, 
  tags, 
  createdAt, 
  updatedAt, 
  onEdit, 
  onDelete, 
  viewMode,
  animationDelay = 0
}: NoteCardProps) {
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } else if (diffInHours < 24 * 7) {
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        hour: '2-digit',
        minute: '2-digit'
      });
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  const truncateContent = (text: string, maxLength: number = viewMode === 'grid' ? 120 : 200) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  const getWordCount = (text: string) => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  if (viewMode === 'list') {
    return (
      <div 
        className="group bg-slate-800/40 backdrop-blur-sm rounded-xl border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10 hover:bg-slate-800/60 animate-fade-in-up"
        style={{ animationDelay: `${animationDelay}ms` }}
      >
        <div className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-lg border border-cyan-500/30">
                  <FileText className="w-4 h-4 text-cyan-400" />
                </div>
                <h3 className="text-lg font-semibold text-white group-hover:text-cyan-400 transition-colors duration-200 truncate">
                  {title || 'Untitled Note'}
                </h3>
              </div>
              
              {content && (
                <p className="text-slate-300 text-sm mb-4 leading-relaxed">
                  {truncateContent(content)}
                </p>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-xs text-slate-500">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(updatedAt)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <FileText className="w-3 h-3" />
                    <span>{getWordCount(content)} words</span>
                  </div>
                </div>

                {tags.length > 0 && (
                  <div className="flex items-center space-x-2">
                    <Tags className="w-3 h-3 text-slate-400" />
                    <div className="flex flex-wrap gap-1">
                      {tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-0.5 bg-slate-700/50 text-slate-300 text-xs rounded-md border border-slate-600/50"
                        >
                          {tag}
                        </span>
                      ))}
                      {tags.length > 3 && (
                        <span className="px-2 py-0.5 bg-slate-700/50 text-slate-400 text-xs rounded-md border border-slate-600/50">
                          +{tags.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-200 ml-4">
              <button
                onClick={() => onEdit(id)}
                className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-slate-700/50 rounded-lg transition-all duration-200 hover:scale-110"
                title="Edit note"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(id)}
                className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-700/50 rounded-lg transition-all duration-200 hover:scale-110"
                title="Delete note"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="group bg-slate-800/40 backdrop-blur-sm rounded-xl border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10 hover:bg-slate-800/60 hover:-translate-y-1 animate-fade-in-up"
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <div className="p-2 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-lg border border-cyan-500/30 flex-shrink-0">
              <FileText className="w-4 h-4 text-cyan-400" />
            </div>
            <h3 className="text-lg font-semibold text-white group-hover:text-cyan-400 transition-colors duration-200 truncate">
              {title || 'Untitled Note'}
            </h3>
          </div>
          <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
            <button
              onClick={() => onEdit(id)}
              className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-slate-700/50 rounded-lg transition-all duration-200 hover:scale-110"
              title="Edit note"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(id)}
              className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-700/50 rounded-lg transition-all duration-200 hover:scale-110"
              title="Delete note"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {content && (
          <p className="text-slate-300 text-sm mb-4 leading-relaxed">
            {truncateContent(content)}
          </p>
        )}

        {tags.length > 0 && (
          <div className="flex items-center space-x-2 mb-4">
            <Tags className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <div className="flex flex-wrap gap-2">
              {tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-slate-700/50 text-slate-300 text-xs rounded-md border border-slate-600/50"
                >
                  {tag}
                </span>
              ))}
              {tags.length > 3 && (
                <span className="px-2 py-1 bg-slate-700/50 text-slate-400 text-xs rounded-md border border-slate-600/50">
                  +{tags.length - 3}
                </span>
              )}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>{formatDate(updatedAt)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <FileText className="w-3 h-3" />
              <span>{getWordCount(content)} words</span>
            </div>
          </div>
          {updatedAt !== createdAt && (
            <div className="flex items-center space-x-1 text-cyan-400/60">
              <div className="w-1 h-1 bg-cyan-400 rounded-full"></div>
              <span>Updated</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
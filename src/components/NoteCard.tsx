import React from 'react';
import { Calendar, Edit3, Trash2, Tags } from 'lucide-react';

interface NoteCardProps {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: number;
  updatedAt: number;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function NoteCard({ id, title, content, tags, createdAt, updatedAt, onEdit, onDelete }: NoteCardProps) {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const truncateContent = (text: string, maxLength: number = 150) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-slate-600 transition-all duration-200 hover:shadow-lg hover:shadow-cyan-500/10 group">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-lg font-semibold text-white group-hover:text-cyan-400 transition-colors duration-200 flex-1 mr-4">
          {title || 'Untitled Note'}
        </h3>
        <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={() => onEdit(id)}
            className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-slate-700 rounded-lg transition-all duration-200"
            title="Edit note"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(id)}
            className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded-lg transition-all duration-200"
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
          <Tags className="w-4 h-4 text-slate-400" />
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-slate-700 text-slate-300 text-xs rounded-md border border-slate-600"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center text-xs text-slate-500 space-x-4">
        <div className="flex items-center space-x-1">
          <Calendar className="w-3 h-3" />
          <span>Created {formatDate(createdAt)}</span>
        </div>
        {updatedAt !== createdAt && (
          <div className="flex items-center space-x-1">
            <span>Updated {formatDate(updatedAt)}</span>
          </div>
        )}
      </div>
    </div>
  );
}
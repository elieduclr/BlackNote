import React, { useState } from 'react';
import { Tags, ChevronDown, X } from 'lucide-react';

interface TagFilterProps {
  allTags: string[];
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
}

export function TagFilter({ allTags, selectedTags, onTagsChange }: TagFilterProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onTagsChange(selectedTags.filter(t => t !== tag));
    } else {
      onTagsChange([...selectedTags, tag]);
    }
  };

  const clearAllTags = () => {
    onTagsChange([]);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white hover:bg-slate-800/70 transition-all duration-200 backdrop-blur-sm"
      >
        <div className="flex items-center space-x-2">
          <Tags className="w-5 h-5 text-slate-400" />
          <span className="text-sm">
            {selectedTags.length === 0 
              ? 'Filter by tags' 
              : `${selectedTags.length} tag${selectedTags.length !== 1 ? 's' : ''} selected`
            }
          </span>
        </div>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-xl z-50 max-h-64 overflow-y-auto">
          {selectedTags.length > 0 && (
            <div className="p-3 border-b border-slate-700/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">Selected Tags</span>
                <button
                  onClick={clearAllTags}
                  className="text-xs text-red-400 hover:text-red-300 transition-colors duration-200"
                >
                  Clear All
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedTags.map(tag => (
                  <span
                    key={tag}
                    className="inline-flex items-center space-x-1 px-2 py-1 bg-cyan-500/20 text-cyan-300 text-xs rounded-md border border-cyan-500/30"
                  >
                    <span>{tag}</span>
                    <button
                      onClick={() => toggleTag(tag)}
                      className="text-cyan-400 hover:text-cyan-300"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
          
          <div className="p-2">
            {allTags.length === 0 ? (
              <div className="px-3 py-2 text-sm text-slate-400 text-center">
                No tags available
              </div>
            ) : (
              allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-all duration-200 ${
                    selectedTags.includes(tag)
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                      : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                  }`}
                >
                  <span>{tag}</span>
                  {selectedTags.includes(tag) && (
                    <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
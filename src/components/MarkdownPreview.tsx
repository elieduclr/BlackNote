import React, { useMemo } from 'react';
import { Eye, EyeOff, FileText, Code, Zap } from 'lucide-react';
import { MarkdownProcessor } from '../utils/markdown';

interface MarkdownPreviewProps {
  content: string;
  isVisible: boolean;
  onToggle: () => void;
  className?: string;
}

export function MarkdownPreview({ content, isVisible, onToggle, className = '' }: MarkdownPreviewProps) {
  const { processedHtml, contentType, metadata } = useMemo(() => {
    const { content: cleanContent, metadata: extractedMetadata } = MarkdownProcessor.extractMetadata(content);
    const type = MarkdownProcessor.detectContentType(cleanContent);
    const html = MarkdownProcessor.toHtml(cleanContent);
    
    return {
      processedHtml: html,
      contentType: type,
      metadata: extractedMetadata
    };
  }, [content]);

  const getContentTypeIcon = () => {
    switch (contentType) {
      case 'markdown':
        return <FileText className="w-3 h-3 text-blue-400" />;
      case 'latex':
        return <Code className="w-3 h-3 text-purple-400" />;
      default:
        return <Zap className="w-3 h-3 text-slate-400" />;
    }
  };

  const getContentTypeLabel = () => {
    switch (contentType) {
      case 'markdown':
        return 'Markdown';
      case 'latex':
        return 'LaTeX';
      default:
        return 'Plain Text';
    }
  };

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Header avec toggle et informations */}
      <div className="flex items-center justify-between p-3 sm:p-4 border-b border-slate-700/50 bg-slate-900/50 flex-shrink-0">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="flex items-center space-x-1.5 sm:space-x-2">
            {getContentTypeIcon()}
            <span className="text-xs sm:text-sm font-medium text-slate-300">
              {getContentTypeLabel()} Preview
            </span>
          </div>
          
          {Object.keys(metadata).length > 0 && (
            <div className="hidden sm:flex items-center space-x-2 text-xs text-slate-400">
              <div className="w-1 h-1 bg-slate-500 rounded-full"></div>
              <span>{Object.keys(metadata).length} metadata</span>
            </div>
          )}
        </div>
        
        <button
          onClick={onToggle}
          className={`flex items-center space-x-1.5 sm:space-x-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg transition-all duration-200 text-xs sm:text-sm font-medium ${
            isVisible
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/30'
              : 'bg-slate-700/50 text-slate-400 border border-slate-600/50 hover:bg-slate-700/70 hover:text-slate-300'
          }`}
          title={isVisible ? 'Hide preview' : 'Show preview'}
        >
          {isVisible ? <EyeOff className="w-3 h-3 sm:w-4 sm:h-4" /> : <Eye className="w-3 h-3 sm:w-4 sm:h-4" />}
          <span className="hidden sm:inline">{isVisible ? 'Hide' : 'Show'}</span>
        </button>
      </div>

      {/* Métadonnées (si présentes) */}
      {isVisible && Object.keys(metadata).length > 0 && (
        <div className="p-3 sm:p-4 bg-slate-800/30 border-b border-slate-700/50 flex-shrink-0">
          <div className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-2">
            Document Metadata
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {Object.entries(metadata).map(([key, value]) => (
              <div key={key} className="flex items-center space-x-2">
                <span className="text-xs text-slate-500 font-mono">{key}:</span>
                <span className="text-xs text-slate-300 truncate">{String(value)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Contenu de la prévisualisation */}
      <div className="flex-1 overflow-y-auto">
        {isVisible ? (
          <div className="p-3 sm:p-4 lg:p-6">
            <div 
              className="prose prose-invert prose-slate max-w-none
                prose-headings:text-white prose-headings:font-semibold
                prose-h1:text-2xl prose-h1:border-b prose-h1:border-slate-600 prose-h1:pb-2
                prose-h2:text-xl prose-h2:text-cyan-300
                prose-h3:text-lg prose-h3:text-blue-300
                prose-p:text-slate-300 prose-p:leading-relaxed
                prose-strong:text-white prose-strong:font-semibold
                prose-em:text-slate-200 prose-em:italic
                prose-ul:text-slate-300 prose-ol:text-slate-300
                prose-li:text-slate-300 prose-li:my-1
                prose-pre:bg-slate-800 prose-pre:border prose-pre:border-slate-600
                prose-code:text-cyan-300 prose-code:bg-slate-700
                prose-hr:border-slate-600
                [&_.task-list-item]:list-none [&_.task-list-item]:pl-0
                [&_.task-list-item_input]:mr-2
                [&_.katex]:text-slate-200
                [&_.katex-display]:overflow-x-auto
                [&_.hljs]:text-sm [&_.hljs]:leading-relaxed
              "
              dangerouslySetInnerHTML={{ __html: processedHtml }}
            />
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 bg-slate-800/50 rounded-full flex items-center justify-center border border-slate-700/50">
                <Eye className="w-6 h-6 sm:w-8 sm:h-8 text-slate-400" />
              </div>
              <p className="text-slate-400 text-sm sm:text-base mb-2">Preview Hidden</p>
              <p className="text-slate-500 text-xs sm:text-sm">
                Click "Show" to see the formatted preview
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
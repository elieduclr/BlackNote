import React from 'react';
import { Shield, Plus, Download, Upload, LogOut, Grid3X3, List, Sparkles } from 'lucide-react';
import { OfflineIndicator } from './OfflineIndicator';

interface HeaderProps {
  onNewNote: () => void;
  onExport: () => void;
  onImport: () => void;
  onLogout: () => void;
  noteCount: number;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
}

export function Header({ 
  onNewNote, 
  onExport, 
  onImport, 
  onLogout, 
  noteCount, 
  viewMode, 
  onViewModeChange 
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-xl border-b border-slate-700/50 shadow-lg">
      <div className="container mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="p-2.5 bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-600 rounded-xl shadow-lg">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                    BlackNote.js
                  </h1>
                  <span className="px-2 py-0.5 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-400 text-xs font-bold rounded-md border border-cyan-500/30">
                    v2.0.1
                  </span>
                  <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
                </div>
                <p className="text-xs text-slate-400 font-medium">Ultra-Secure Local Notes</p>
              </div>
            </div>
            
            <div className="hidden lg:block h-8 w-px bg-gradient-to-b from-transparent via-slate-600 to-transparent"></div>
            
            <div className="hidden lg:flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-2 px-3 py-1.5 bg-slate-800/50 rounded-lg border border-slate-700/50">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                <span className="text-slate-300 font-medium">{noteCount}</span>
                <span className="text-slate-400">note{noteCount !== 1 ? 's' : ''}</span>
              </div>
              <div className="flex items-center space-x-2 px-3 py-1.5 bg-slate-800/50 rounded-lg border border-slate-700/50">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-slate-400">100% Local</span>
              </div>
              <div className="flex items-center space-x-2 px-3 py-1.5 bg-slate-800/50 rounded-lg border border-slate-700/50">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span className="text-slate-400">Encrypted</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Offline Indicator */}
            <OfflineIndicator />

            {/* View Mode Toggle */}
            <div className="hidden sm:flex items-center bg-slate-800/50 rounded-lg border border-slate-700/50 p-1">
              <button
                onClick={() => onViewModeChange('grid')}
                className={`p-2 rounded-md transition-all duration-200 ${
                  viewMode === 'grid'
                    ? 'bg-cyan-500 text-white shadow-lg'
                    : 'text-slate-400 hover:text-slate-300 hover:bg-slate-700/50'
                }`}
                title="Grid view"
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => onViewModeChange('list')}
                className={`p-2 rounded-md transition-all duration-200 ${
                  viewMode === 'list'
                    ? 'bg-cyan-500 text-white shadow-lg'
                    : 'text-slate-400 hover:text-slate-300 hover:bg-slate-700/50'
                }`}
                title="List view"
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* Action Buttons */}
            <button
              onClick={onNewNote}
              className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-600 hover:via-blue-700 hover:to-purple-700 text-white font-medium rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 hover:-translate-y-0.5"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">New Note</span>
            </button>

            <div className="flex items-center space-x-1">
              <button
                onClick={onImport}
                className="p-2.5 text-slate-400 hover:text-cyan-400 hover:bg-slate-800/50 rounded-xl transition-all duration-200 hover:scale-110"
                title="Import backup"
              >
                <Upload className="w-5 h-5" />
              </button>
              <button
                onClick={onExport}
                className="p-2.5 text-slate-400 hover:text-blue-400 hover:bg-slate-800/50 rounded-xl transition-all duration-200 hover:scale-110"
                title="Export backup"
              >
                <Download className="w-5 h-5" />
              </button>
              <button
                onClick={onLogout}
                className="p-2.5 text-slate-400 hover:text-red-400 hover:bg-slate-800/50 rounded-xl transition-all duration-200 hover:scale-110"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
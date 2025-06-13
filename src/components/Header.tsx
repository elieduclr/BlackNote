import React from 'react';
import { Shield, Plus, Download, Upload, Settings, LogOut } from 'lucide-react';

interface HeaderProps {
  onNewNote: () => void;
  onExport: () => void;
  onImport: () => void;
  onLogout: () => void;
  noteCount: number;
}

export function Header({ onNewNote, onExport, onImport, onLogout, noteCount }: HeaderProps) {
  return (
    <header className="bg-slate-900 border-b border-slate-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">BlackNote.js</h1>
              <p className="text-xs text-slate-400">Ultra-Secure Local Notes</p>
            </div>
          </div>
          <div className="hidden sm:block h-6 w-px bg-slate-700"></div>
          <div className="hidden sm:flex items-center space-x-2 text-sm text-slate-400">
            <span>{noteCount} note{noteCount !== 1 ? 's' : ''}</span>
            <span className="w-1 h-1 bg-slate-500 rounded-full"></span>
            <span>100% Local</span>
            <span className="w-1 h-1 bg-slate-500 rounded-full"></span>
            <span className="text-cyan-400">Encrypted</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onNewNote}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Note</span>
          </button>

          <div className="flex items-center space-x-1">
            <button
              onClick={onImport}
              className="p-2 text-slate-400 hover:text-slate-300 hover:bg-slate-800 rounded-lg transition-all duration-200"
              title="Import backup"
            >
              <Upload className="w-5 h-5" />
            </button>
            <button
              onClick={onExport}
              className="p-2 text-slate-400 hover:text-slate-300 hover:bg-slate-800 rounded-lg transition-all duration-200"
              title="Export backup"
            >
              <Download className="w-5 h-5" />
            </button>
            <button
              onClick={onLogout}
              className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-all duration-200"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
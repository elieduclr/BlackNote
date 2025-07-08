import React from 'react';
import { Shield, Plus, Download, Upload, LogOut, Grid3X3, List, Sparkles, Menu, X } from 'lucide-react';
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-xl border-b border-slate-700/50 shadow-lg">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Logo et titre - Responsive */}
          <div className="flex items-center space-x-3 sm:space-x-4 lg:space-x-6 min-w-0 flex-1">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="relative flex-shrink-0">
                <div className="p-2 sm:p-2.5 bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-600 rounded-lg sm:rounded-xl shadow-lg">
                  <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <div className="min-w-0">
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent truncate">
                    BlackNote.js
                  </h1>
                  <span className="hidden xs:inline-block px-1.5 py-0.5 sm:px-2 sm:py-0.5 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-400 text-xs font-bold rounded border border-cyan-500/30 flex-shrink-0">
                    v2.0.4
                  </span>
                  <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-cyan-400 animate-pulse flex-shrink-0" />
                </div>
                <p className="text-xs text-slate-400 font-medium hidden sm:block">Ultra-Secure Local Notes</p>
              </div>
            </div>
            
            {/* Séparateur et stats - Desktop uniquement */}
            <div className="hidden xl:block h-8 w-px bg-gradient-to-b from-transparent via-slate-600 to-transparent"></div>
            
            <div className="hidden xl:flex items-center space-x-4 text-sm">
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

          {/* Actions Desktop */}
          <div className="hidden md:flex items-center space-x-2 lg:space-x-3">
            <div className="order-1">
              <OfflineIndicator />
            </div>

            {/* View Mode Toggle - Tablette et Desktop */}
            <div className="hidden lg:flex items-center bg-slate-800/50 rounded-lg border border-slate-700/50 p-1 order-2">
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

            {/* New Note Button */}
            <button
              onClick={onNewNote}
              className="flex items-center space-x-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-600 hover:via-blue-700 hover:to-purple-700 text-white font-medium rounded-lg sm:rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 hover:-translate-y-0.5 order-3"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden lg:inline">New Note</span>
            </button>

            {/* Action Buttons */}
            <div className="flex items-center space-x-1 order-4">
              <button
                onClick={onImport}
                className="p-2 sm:p-2.5 text-slate-400 hover:text-cyan-400 hover:bg-slate-800/50 rounded-lg sm:rounded-xl transition-all duration-200 hover:scale-110"
                title="Import backup"
              >
                <Upload className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <button
                onClick={onExport}
                className="p-2 sm:p-2.5 text-slate-400 hover:text-blue-400 hover:bg-slate-800/50 rounded-lg sm:rounded-xl transition-all duration-200 hover:scale-110"
                title="Export backup"
              >
                <Download className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <button
                onClick={onLogout}
                className="p-2 sm:p-2.5 text-slate-400 hover:text-red-400 hover:bg-slate-800/50 rounded-lg sm:rounded-xl transition-all duration-200 hover:scale-110"
                title="Logout"
              >
                <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>

          {/* Mobile Actions */}
          <div className="flex md:hidden items-center space-x-2">
            <div className="order-1">
              <OfflineIndicator />
            </div>
            
            {/* New Note Button Mobile */}
            <button
              onClick={onNewNote}
              className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-600 hover:via-blue-700 hover:to-purple-700 text-white rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 order-2"
            >
              <Plus className="w-5 h-5" />
            </button>

            {/* Menu Mobile */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex items-center justify-center w-10 h-10 text-slate-400 hover:text-slate-300 hover:bg-slate-800/50 rounded-lg transition-all duration-200 order-3"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Menu Mobile Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 p-4 bg-slate-800/50 backdrop-blur-xl rounded-xl border border-slate-700/50 animate-fade-in">
            <div className="space-y-4">
              {/* Stats Mobile */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                  <span className="text-slate-300 font-medium">{noteCount} note{noteCount !== 1 ? 's' : ''}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-slate-400">100% Local & Encrypted</span>
                </div>
              </div>

              {/* View Mode Mobile */}
              <div className="flex items-center justify-center space-x-2">
                <span className="text-sm text-slate-400">View:</span>
                <div className="flex items-center bg-slate-700/50 rounded-lg p-1">
                  <button
                    onClick={() => {
                      onViewModeChange('grid');
                      setIsMobileMenuOpen(false);
                    }}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-all duration-200 ${
                      viewMode === 'grid'
                        ? 'bg-cyan-500 text-white shadow-lg'
                        : 'text-slate-400 hover:text-slate-300'
                    }`}
                  >
                    <Grid3X3 className="w-4 h-4" />
                    <span className="text-sm">Grid</span>
                  </button>
                  <button
                    onClick={() => {
                      onViewModeChange('list');
                      setIsMobileMenuOpen(false);
                    }}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-all duration-200 ${
                      viewMode === 'list'
                        ? 'bg-cyan-500 text-white shadow-lg'
                        : 'text-slate-400 hover:text-slate-300'
                    }`}
                  >
                    <List className="w-4 h-4" />
                    <span className="text-sm">List</span>
                  </button>
                </div>
              </div>

              {/* Actions Mobile */}
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => {
                    onImport();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex flex-col items-center space-y-2 p-3 text-slate-400 hover:text-cyan-400 hover:bg-slate-700/50 rounded-lg transition-all duration-200"
                >
                  <Upload className="w-5 h-5" />
                  <span className="text-xs">Import</span>
                </button>
                <button
                  onClick={() => {
                    onExport();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex flex-col items-center space-y-2 p-3 text-slate-400 hover:text-blue-400 hover:bg-slate-700/50 rounded-lg transition-all duration-200"
                >
                  <Download className="w-5 h-5" />
                  <span className="text-xs">Export</span>
                </button>
                <button
                  onClick={() => {
                    onLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex flex-col items-center space-y-2 p-3 text-slate-400 hover:text-red-400 hover:bg-slate-700/50 rounded-lg transition-all duration-200"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="text-xs">Logout</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
import React from 'react';
import { FileText, Shield, Lock, Sparkles, Plus } from 'lucide-react';

interface EmptyStateProps {
  onNewNote: () => void;
}

export function EmptyState({ onNewNote }: EmptyStateProps) {
  return (
    <div className="flex-1 flex items-center justify-center p-4 sm:p-8 min-h-[60vh]">
      <div className="text-center max-w-lg">
        <div className="mb-6 sm:mb-8">
          <div className="relative inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 mb-6 sm:mb-8">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-blue-600/20 to-purple-600/20 rounded-2xl sm:rounded-3xl border border-cyan-500/30 backdrop-blur-sm"></div>
            <FileText className="relative w-10 h-10 sm:w-12 sm:h-12 text-cyan-400" />
            <Sparkles className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-5 h-5 sm:w-6 sm:h-6 text-cyan-400 animate-bounce" />
          </div>
          
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white via-cyan-200 to-blue-200 bg-clip-text text-transparent mb-3 sm:mb-4">
            No Notes Yet
          </h2>
          <p className="text-slate-400 leading-relaxed mb-6 sm:mb-8 text-base sm:text-lg px-4 sm:px-0">
            Create your first ultra-secure note. All data is encrypted locally using our 
            <span className="text-cyan-400 font-medium"> Double Lock & Obfuscate</span> algorithm 
            and never leaves your device.
          </p>
        </div>

        <button
          onClick={onNewNote}
          className="inline-flex items-center space-x-2 sm:space-x-3 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-600 hover:via-blue-700 hover:to-purple-700 text-white font-medium rounded-lg sm:rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 hover:-translate-y-1 mb-8 sm:mb-12"
        >
          <Plus className="w-5 h-5" />
          <span className="text-sm sm:text-base">Create Your First Note</span>
          <Sparkles className="w-5 h-5 animate-pulse" />
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 text-sm">
          <div className="group p-4 sm:p-6 bg-slate-800/40 backdrop-blur-sm rounded-lg sm:rounded-xl border border-slate-700/50 hover:border-cyan-500/30 transition-all duration-300 hover:bg-slate-800/60">
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-lg border border-cyan-500/30">
                <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-slate-200 group-hover:text-white transition-colors duration-200 text-sm sm:text-base">
                  ChaCha20 + AES-256
                </p>
                <p className="text-slate-400 text-xs">Double encryption layer</p>
              </div>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Military-grade encryption with dual-layer protection for maximum security.
            </p>
          </div>
          
          <div className="group p-4 sm:p-6 bg-slate-800/40 backdrop-blur-sm rounded-lg sm:rounded-xl border border-slate-700/50 hover:border-purple-500/30 transition-all duration-300 hover:bg-slate-800/60">
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 bg-gradient-to-br from-purple-500/20 to-pink-600/20 rounded-lg border border-purple-500/30">
                <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-slate-200 group-hover:text-white transition-colors duration-200 text-sm sm:text-base">
                  HMAC Integrity
                </p>
                <p className="text-slate-400 text-xs">Tamper detection</p>
              </div>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Advanced integrity verification to detect any unauthorized modifications.
            </p>
          </div>
        </div>

        <div className="mt-6 sm:mt-8 p-3 sm:p-4 bg-slate-900/30 rounded-lg sm:rounded-xl border border-slate-700/30 backdrop-blur-sm">
          <p className="text-xs text-slate-500 italic">
            "When privacy matters, trust no cloud." - Your data never leaves your device.
          </p>
        </div>
      </div>
    </div>
  );
}
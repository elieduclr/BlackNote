import React from 'react';
import { FileText, Shield, Lock } from 'lucide-react';

interface EmptyStateProps {
  onNewNote: () => void;
}

export function EmptyState({ onNewNote }: EmptyStateProps) {
  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-3xl mb-6 border border-cyan-500/30">
            <FileText className="w-10 h-10 text-cyan-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">No Notes Yet</h2>
          <p className="text-slate-400 leading-relaxed mb-8">
            Create your first ultra-secure note. All data is encrypted locally using our 
            Double Lock & Obfuscate algorithm and never leaves your device.
          </p>
        </div>

        <button
          onClick={onNewNote}
          className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 mb-8"
        >
          <FileText className="w-5 h-5" />
          <span>Create Your First Note</span>
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center space-x-3 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
            <Shield className="w-5 h-5 text-cyan-400 flex-shrink-0" />
            <div className="text-left">
              <p className="font-medium text-slate-300">ChaCha20 + AES-256</p>
              <p className="text-slate-500">Double encryption</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
            <Lock className="w-5 h-5 text-cyan-400 flex-shrink-0" />
            <div className="text-left">
              <p className="font-medium text-slate-300">HMAC Integrity</p>
              <p className="text-slate-500">Tamper detection</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
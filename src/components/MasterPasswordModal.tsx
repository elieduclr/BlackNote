import React, { useState, useEffect } from 'react';
import { Lock, Eye, EyeOff, Shield, Sparkles, Key } from 'lucide-react';

interface MasterPasswordModalProps {
  isOpen: boolean;
  onPasswordSubmit: (password: string) => void;
  error?: string;
  isLoading?: boolean;
}

export function MasterPasswordModal({ isOpen, onPasswordSubmit, error, isLoading }: MasterPasswordModalProps) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.trim() && !isLoading) {
      onPasswordSubmit(password);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-purple-500/10"></div>
      
      <div 
        className={`relative bg-slate-800/90 backdrop-blur-xl rounded-2xl p-8 w-full max-w-md shadow-2xl border border-slate-700/50 transform transition-all duration-500 ${
          isAnimating ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4'
        }`}
      >
        {/* Animated background elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden rounded-2xl">
          <div className="absolute -top-4 -left-4 w-24 h-24 bg-cyan-500/10 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-purple-500/10 rounded-full blur-xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10">
          <div className="text-center mb-8">
            <div className="relative inline-flex items-center justify-center w-20 h-20 mb-6">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-600 rounded-2xl animate-pulse"></div>
              <div className="relative bg-slate-800 rounded-2xl p-4 m-1">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <Sparkles className="absolute -top-1 -right-1 w-5 h-5 text-cyan-400 animate-bounce" />
            </div>
            
            <h2 className="text-3xl font-bold bg-gradient-to-r from-white via-cyan-200 to-blue-200 bg-clip-text text-transparent mb-3">
              BlackNote.js
            </h2>
            <p className="text-slate-400 text-sm font-medium">
              "When privacy matters, trust no cloud."
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-3">
                <div className="flex items-center space-x-2">
                  <Key className="w-4 h-4 text-cyan-400" />
                  <span>Master Password</span>
                </div>
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-cyan-400 transition-colors duration-200" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-14 py-4 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all duration-200 backdrop-blur-sm"
                  placeholder="Enter your master password"
                  autoFocus
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-300 transition-colors duration-200"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {error && (
                <div className="mt-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <p className="text-sm text-red-400 flex items-center space-x-2">
                    <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                    <span>{error}</span>
                  </p>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={!password.trim() || isLoading}
              className="w-full py-4 px-6 bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-600 hover:via-blue-700 hover:to-purple-700 disabled:from-slate-600 disabled:to-slate-700 text-white font-medium rounded-xl transition-all duration-300 transform hover:scale-[1.02] disabled:hover:scale-100 disabled:cursor-not-allowed shadow-lg hover:shadow-xl disabled:opacity-50"
            >
              <div className="flex items-center justify-center space-x-2">
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Unlocking...</span>
                  </>
                ) : (
                  <>
                    <Shield className="w-5 h-5" />
                    <span>Unlock BlackNote</span>
                  </>
                )}
              </div>
            </button>
          </form>

          <div className="mt-8 p-4 bg-slate-900/30 rounded-xl border border-slate-700/30 backdrop-blur-sm">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-lg border border-cyan-500/30 flex-shrink-0">
                <Shield className="w-5 h-5 text-cyan-400" />
              </div>
              <div className="text-sm text-slate-400">
                <p className="font-medium text-slate-300 mb-2">Ultra-Secure Encryption</p>
                <p className="leading-relaxed">
                  Your notes are protected with our proprietary <span className="text-cyan-400 font-medium">Double Lock & Obfuscate</span> algorithm: 
                  ChaCha20 + AES-256-GCM with HMAC integrity verification.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
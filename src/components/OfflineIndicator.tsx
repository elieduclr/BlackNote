import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, Download, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';
import { serviceWorkerManager, type ServiceWorkerStatus } from '../utils/serviceWorker';

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [swStatus, setSwStatus] = useState<ServiceWorkerStatus>({
    isSupported: false,
    isRegistered: false,
    isActive: false,
    updateAvailable: false
  });
  const [showDetails, setShowDetails] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    // Online/offline detection
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Service Worker status monitoring
    const unsubscribe = serviceWorkerManager.onStatusChange(setSwStatus);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      unsubscribe();
    };
  }, []);

  const handleUpdate = async () => {
    if (!swStatus.updateAvailable) return;

    setIsUpdating(true);
    try {
      await serviceWorkerManager.updateServiceWorker();
      // Reload page after update
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error('Failed to update:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusColor = () => {
    if (!isOnline) return 'text-red-400';
    if (swStatus.updateAvailable) return 'text-yellow-400';
    if (swStatus.isActive) return 'text-green-400';
    return 'text-slate-400';
  };

  const getStatusIcon = () => {
    if (!isOnline) return <WifiOff className="w-4 h-4" />;
    if (swStatus.updateAvailable) return <Download className="w-4 h-4" />;
    if (swStatus.isActive) return <Wifi className="w-4 h-4" />;
    return <AlertCircle className="w-4 h-4" />;
  };

  const getStatusText = () => {
    if (!isOnline) return 'Offline';
    if (swStatus.updateAvailable) return 'Update Available';
    if (swStatus.isActive) return 'Offline Ready';
    if (swStatus.isSupported && !swStatus.isRegistered) return 'Installing...';
    if (!swStatus.isSupported) return 'Limited Offline';
    return 'Online';
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowDetails(!showDetails)}
        className={`flex items-center space-x-2 px-3 py-1.5 bg-slate-800/50 rounded-lg border border-slate-700/50 transition-all duration-200 hover:bg-slate-800/70 ${getStatusColor()}`}
        title={`Network status: ${getStatusText()}`}
      >
        {getStatusIcon()}
        <span className="text-sm font-medium">{getStatusText()}</span>
        {swStatus.updateAvailable && (
          <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
        )}
      </button>

      {showDetails && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-xl z-50 p-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">Offline Status</h3>
              <button
                onClick={() => setShowDetails(false)}
                className="text-slate-400 hover:text-slate-300"
              >
                ×
              </button>
            </div>

            <div className="space-y-3">
              {/* Network Status */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {isOnline ? (
                    <Wifi className="w-4 h-4 text-green-400" />
                  ) : (
                    <WifiOff className="w-4 h-4 text-red-400" />
                  )}
                  <span className="text-sm text-slate-300">Network</span>
                </div>
                <span className={`text-sm font-medium ${isOnline ? 'text-green-400' : 'text-red-400'}`}>
                  {isOnline ? 'Connected' : 'Disconnected'}
                </span>
              </div>

              {/* Service Worker Status */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {swStatus.isActive ? (
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-yellow-400" />
                  )}
                  <span className="text-sm text-slate-300">Offline Mode</span>
                </div>
                <span className={`text-sm font-medium ${swStatus.isActive ? 'text-green-400' : 'text-yellow-400'}`}>
                  {swStatus.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>

              {/* Version Info */}
              {swStatus.version && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-300">Version</span>
                  <span className="text-sm font-medium text-slate-400">
                    v{swStatus.version}
                  </span>
                </div>
              )}

              {/* Update Available */}
              {swStatus.updateAvailable && (
                <div className="pt-3 border-t border-slate-700/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-yellow-400 font-medium">Update Available</span>
                    <Download className="w-4 h-4 text-yellow-400" />
                  </div>
                  <button
                    onClick={handleUpdate}
                    disabled={isUpdating}
                    className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 disabled:from-slate-600 disabled:to-slate-700 text-white text-sm font-medium rounded-lg transition-all duration-200 disabled:cursor-not-allowed"
                  >
                    {isUpdating ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Updating...</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        <span>Update Now</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Offline Capabilities */}
              <div className="pt-3 border-t border-slate-700/50">
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
                  Offline Features
                </h4>
                <div className="space-y-1 text-xs text-slate-500">
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${swStatus.isActive ? 'bg-green-400' : 'bg-slate-600'}`}></div>
                    <span>Create & edit notes</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${swStatus.isActive ? 'bg-green-400' : 'bg-slate-600'}`}></div>
                    <span>Search & filter</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${swStatus.isActive ? 'bg-green-400' : 'bg-slate-600'}`}></div>
                    <span>Export & import</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${swStatus.isActive ? 'bg-green-400' : 'bg-slate-600'}`}></div>
                    <span>Full encryption</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
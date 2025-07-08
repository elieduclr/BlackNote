import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, Download, RefreshCw, AlertCircle, CheckCircle, X, Smartphone, Monitor, Tablet } from 'lucide-react';
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
    if (!isOnline) return <WifiOff className="w-3 h-3 sm:w-4 sm:h-4" />;
    if (swStatus.updateAvailable) return <Download className="w-3 h-3 sm:w-4 sm:h-4" />;
    if (swStatus.isActive) return <Wifi className="w-3 h-3 sm:w-4 sm:h-4" />;
    return <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />;
  };

  const getStatusText = () => {
    if (!isOnline) return 'Offline';
    if (swStatus.updateAvailable) return 'Update';
    if (swStatus.isActive) return 'Ready';
    if (swStatus.isSupported && !swStatus.isRegistered) return 'Loading';
    if (!swStatus.isSupported) return 'Limited';
    return 'Online';
  };

  const getFullStatusText = () => {
    if (!isOnline) return 'Offline Mode';
    if (swStatus.updateAvailable) return 'Update Available';
    if (swStatus.isActive) return 'Offline Ready';
    if (swStatus.isSupported && !swStatus.isRegistered) return 'Installing...';
    if (!swStatus.isSupported) return 'Limited Offline';
    return 'Online Mode';
  };

  return (
    <div className="relative">
      {/* Compact indicator for mobile, full for desktop */}
      <button
        onClick={() => setShowDetails(!showDetails)}
        className={`flex items-center space-x-1 sm:space-x-1.5 lg:space-x-2 px-1.5 sm:px-2 lg:px-3 py-1 sm:py-1.5 bg-slate-800/50 rounded-md sm:rounded-lg border border-slate-700/50 transition-all duration-200 hover:bg-slate-800/70 ${getStatusColor()}`}
        title={`Network status: ${getFullStatusText()}`}
      >
        {getStatusIcon()}
        
        {/* Text visibility based on screen size */}
        <span className="text-xs font-medium hidden xs:inline sm:hidden lg:inline">
          {getStatusText()}
        </span>
        <span className="text-xs sm:text-sm font-medium hidden sm:inline lg:hidden">
          {getFullStatusText()}
        </span>
        
        {/* Update indicator */}
        {swStatus.updateAvailable && (
          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-yellow-400 rounded-full animate-pulse flex-shrink-0"></div>
        )}
      </button>

      {/* Responsive details panel */}
      {showDetails && (
        <>
          {/* Mobile overlay */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setShowDetails(false)}
          />
          
          {/* Details panel - responsive positioning */}
          <div className={`
            absolute z-50 bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 shadow-xl
            fixed md:absolute
            bottom-0 left-0 right-0 md:top-full md:right-0 md:left-auto md:bottom-auto
            w-full md:w-80 lg:w-96
            rounded-t-xl md:rounded-xl md:rounded-tr-none
            mt-0 md:mt-2
            max-h-[70vh] md:max-h-[80vh]
            overflow-y-auto
          `}>
            <div className="p-3 sm:p-4 lg:p-5">
              {/* Header - responsive */}
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="p-1.5 sm:p-2 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-lg border border-cyan-500/30">
                    {getStatusIcon()}
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-semibold text-white">
                      PWA Status
                    </h3>
                    <p className="text-xs text-slate-400 hidden sm:block">
                      Progressive Web App
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowDetails(false)}
                  className="p-1.5 sm:p-2 text-slate-400 hover:text-slate-300 hover:bg-slate-700/50 rounded-lg transition-all duration-200"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>

              <div className="space-y-3 sm:space-y-4">
                {/* Network Status - responsive */}
                <div className="flex items-center justify-between p-2 sm:p-3 bg-slate-900/50 rounded-lg border border-slate-700/30">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    {isOnline ? (
                      <Wifi className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 flex-shrink-0" />
                    ) : (
                      <WifiOff className="w-4 h-4 sm:w-5 sm:h-5 text-red-400 flex-shrink-0" />
                    )}
                    <div>
                      <span className="text-sm sm:text-base text-slate-300 font-medium">Network</span>
                      <p className="text-xs text-slate-500 hidden sm:block">Internet connection</p>
                    </div>
                  </div>
                  <span className={`text-xs sm:text-sm font-medium px-2 py-1 rounded-md ${
                    isOnline 
                      ? 'text-green-400 bg-green-400/10 border border-green-400/20' 
                      : 'text-red-400 bg-red-400/10 border border-red-400/20'
                  }`}>
                    {isOnline ? 'Connected' : 'Disconnected'}
                  </span>
                </div>

                {/* Service Worker Status - responsive */}
                <div className="flex items-center justify-between p-2 sm:p-3 bg-slate-900/50 rounded-lg border border-slate-700/30">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    {swStatus.isActive ? (
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 flex-shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 flex-shrink-0" />
                    )}
                    <div>
                      <span className="text-sm sm:text-base text-slate-300 font-medium">Offline Mode</span>
                      <p className="text-xs text-slate-500 hidden sm:block">Service Worker status</p>
                    </div>
                  </div>
                  <span className={`text-xs sm:text-sm font-medium px-2 py-1 rounded-md ${
                    swStatus.isActive 
                      ? 'text-green-400 bg-green-400/10 border border-green-400/20' 
                      : 'text-yellow-400 bg-yellow-400/10 border border-yellow-400/20'
                  }`}>
                    {swStatus.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>

                {/* Device Type Indicator - responsive */}
                <div className="flex items-center justify-between p-2 sm:p-3 bg-slate-900/50 rounded-lg border border-slate-700/30">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <div className="block sm:hidden">
                      <Smartphone className="w-4 h-4 text-cyan-400" />
                    </div>
                    <div className="hidden sm:block md:hidden">
                      <Tablet className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div className="hidden md:block">
                      <Monitor className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div>
                      <span className="text-sm sm:text-base text-slate-300 font-medium">Device</span>
                      <p className="text-xs text-slate-500 hidden sm:block">Current platform</p>
                    </div>
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-cyan-400 bg-cyan-400/10 border border-cyan-400/20 px-2 py-1 rounded-md">
                    <span className="block sm:hidden">Mobile</span>
                    <span className="hidden sm:block md:hidden">Tablet</span>
                    <span className="hidden md:block">Desktop</span>
                  </span>
                </div>

                {/* Version Info - responsive */}
                {swStatus.version && (
                  <div className="flex items-center justify-between p-2 sm:p-3 bg-slate-900/50 rounded-lg border border-slate-700/30">
                    <span className="text-sm sm:text-base text-slate-300 font-medium">Version</span>
                    <span className="text-xs sm:text-sm font-mono text-slate-400 bg-slate-800/50 px-2 py-1 rounded border border-slate-600/30">
                      v{swStatus.version}
                    </span>
                  </div>
                )}

                {/* Update Available - responsive */}
                {swStatus.updateAvailable && (
                  <div className="p-3 sm:p-4 border-t border-slate-700/50 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-lg border border-yellow-500/20">
                    <div className="flex items-center justify-between mb-2 sm:mb-3">
                      <div className="flex items-center space-x-2">
                        <Download className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
                        <span className="text-sm sm:text-base text-yellow-400 font-medium">Update Available</span>
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-400 mb-3 leading-relaxed">
                      A new version of BlackNote.js is ready to install with improved features and security.
                    </p>
                    <button
                      onClick={handleUpdate}
                      disabled={isUpdating}
                      className="w-full flex items-center justify-center space-x-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 disabled:from-slate-600 disabled:to-slate-700 text-white text-sm sm:text-base font-medium rounded-lg transition-all duration-200 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
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

                {/* Offline Capabilities - responsive */}
                <div className="p-3 sm:p-4 border-t border-slate-700/50">
                  <h4 className="text-xs sm:text-sm font-semibold text-slate-400 uppercase tracking-wide mb-2 sm:mb-3 flex items-center space-x-2">
                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>Offline Features</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                    {[
                      { label: 'Create & edit notes', active: swStatus.isActive },
                      { label: 'Search & filter', active: swStatus.isActive },
                      { label: 'Export & import', active: swStatus.isActive },
                      { label: 'Full encryption', active: swStatus.isActive }
                    ].map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2 p-2 bg-slate-800/30 rounded-lg">
                        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                          feature.active ? 'bg-green-400' : 'bg-slate-600'
                        }`}></div>
                        <span className="text-xs sm:text-sm text-slate-300 truncate">{feature.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* PWA Installation Hint - responsive */}
                <div className="p-3 sm:p-4 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-lg border border-cyan-500/20">
                  <div className="flex items-start space-x-2 sm:space-x-3">
                    <div className="p-1.5 sm:p-2 bg-cyan-500/20 rounded-lg border border-cyan-500/30 flex-shrink-0">
                      <Smartphone className="w-3 h-3 sm:w-4 sm:h-4 text-cyan-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-medium text-cyan-300 mb-1">
                        Install as App
                      </p>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        <span className="block sm:hidden">
                          Add to home screen for native app experience
                        </span>
                        <span className="hidden sm:block">
                          Install BlackNote.js as a native app for the best offline experience
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
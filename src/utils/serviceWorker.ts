// Service Worker registration and management for BlackNote.js v2.0.0

export interface ServiceWorkerStatus {
  isSupported: boolean;
  isRegistered: boolean;
  isActive: boolean;
  version?: string;
  updateAvailable: boolean;
}

export class ServiceWorkerManager {
  private registration: ServiceWorkerRegistration | null = null;
  private statusCallbacks: ((status: ServiceWorkerStatus) => void)[] = [];

  constructor() {
    this.init();
  }

  private async init() {
    if (!this.isSupported()) {
      console.warn('[SW Manager] Service Workers not supported');
      this.notifyStatusChange({
        isSupported: false,
        isRegistered: false,
        isActive: false,
        updateAvailable: false
      });
      return;
    }

    try {
      await this.register();
      this.setupEventListeners();
    } catch (error) {
      console.error('[SW Manager] Failed to initialize:', error);
    }
  }

  private isSupported(): boolean {
    return 'serviceWorker' in navigator;
  }

  private async register(): Promise<void> {
    try {
      console.log('[SW Manager] Registering Service Worker...');
      
      this.registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
        updateViaCache: 'none'
      });

      console.log('[SW Manager] Service Worker registered successfully');
      
      // Check for updates
      this.registration.addEventListener('updatefound', () => {
        console.log('[SW Manager] Service Worker update found');
        this.handleUpdateFound();
      });

      // Initial status check
      await this.checkStatus();
      
    } catch (error) {
      console.error('[SW Manager] Service Worker registration failed:', error);
      throw error;
    }
  }

  private setupEventListeners(): void {
    if (!navigator.serviceWorker) return;

    // Listen for controller changes
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      console.log('[SW Manager] Controller changed');
      this.checkStatus();
    });

    // Listen for messages from Service Worker
    navigator.serviceWorker.addEventListener('message', (event) => {
      console.log('[SW Manager] Message from SW:', event.data);
      this.handleServiceWorkerMessage(event.data);
    });
  }

  private handleUpdateFound(): void {
    if (!this.registration) return;

    const newWorker = this.registration.installing;
    if (!newWorker) return;

    newWorker.addEventListener('statechange', () => {
      if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
        console.log('[SW Manager] New Service Worker installed, update available');
        this.notifyStatusChange({
          isSupported: true,
          isRegistered: true,
          isActive: true,
          updateAvailable: true
        });
      }
    });
  }

  private handleServiceWorkerMessage(data: any): void {
    if (data.type === 'VERSION_INFO') {
      console.log('[SW Manager] Service Worker version:', data.version);
    }
  }

  private async checkStatus(): Promise<void> {
    const status: ServiceWorkerStatus = {
      isSupported: this.isSupported(),
      isRegistered: !!this.registration,
      isActive: !!navigator.serviceWorker.controller,
      updateAvailable: false
    };

    // Get version from Service Worker
    if (navigator.serviceWorker.controller) {
      try {
        const version = await this.getServiceWorkerVersion();
        status.version = version;
      } catch (error) {
        console.warn('[SW Manager] Failed to get SW version:', error);
      }
    }

    this.notifyStatusChange(status);
  }

  private async getServiceWorkerVersion(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!navigator.serviceWorker.controller) {
        reject(new Error('No active Service Worker'));
        return;
      }

      const messageChannel = new MessageChannel();
      messageChannel.port1.onmessage = (event) => {
        if (event.data.version) {
          resolve(event.data.version);
        } else {
          reject(new Error('No version received'));
        }
      };

      navigator.serviceWorker.controller.postMessage(
        { type: 'GET_VERSION' },
        [messageChannel.port2]
      );

      // Timeout after 5 seconds
      setTimeout(() => {
        reject(new Error('Version request timeout'));
      }, 5000);
    });
  }

  private notifyStatusChange(status: ServiceWorkerStatus): void {
    this.statusCallbacks.forEach(callback => {
      try {
        callback(status);
      } catch (error) {
        console.error('[SW Manager] Status callback error:', error);
      }
    });
  }

  // Public methods
  public onStatusChange(callback: (status: ServiceWorkerStatus) => void): () => void {
    this.statusCallbacks.push(callback);
    
    // Return unsubscribe function
    return () => {
      const index = this.statusCallbacks.indexOf(callback);
      if (index > -1) {
        this.statusCallbacks.splice(index, 1);
      }
    };
  }

  public async updateServiceWorker(): Promise<void> {
    if (!this.registration) {
      throw new Error('No Service Worker registration found');
    }

    try {
      console.log('[SW Manager] Checking for Service Worker updates...');
      await this.registration.update();
      
      if (this.registration.waiting) {
        console.log('[SW Manager] Activating new Service Worker...');
        this.registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      }
    } catch (error) {
      console.error('[SW Manager] Failed to update Service Worker:', error);
      throw error;
    }
  }

  public async unregister(): Promise<void> {
    if (!this.registration) {
      console.warn('[SW Manager] No Service Worker to unregister');
      return;
    }

    try {
      console.log('[SW Manager] Unregistering Service Worker...');
      await this.registration.unregister();
      this.registration = null;
      
      this.notifyStatusChange({
        isSupported: this.isSupported(),
        isRegistered: false,
        isActive: false,
        updateAvailable: false
      });
      
      console.log('[SW Manager] Service Worker unregistered successfully');
    } catch (error) {
      console.error('[SW Manager] Failed to unregister Service Worker:', error);
      throw error;
    }
  }

  public async clearCache(): Promise<void> {
    if (!navigator.serviceWorker.controller) {
      throw new Error('No active Service Worker');
    }

    try {
      console.log('[SW Manager] Clearing Service Worker cache...');
      navigator.serviceWorker.controller.postMessage({ type: 'CLEAR_CACHE' });
      console.log('[SW Manager] Cache clear request sent');
    } catch (error) {
      console.error('[SW Manager] Failed to clear cache:', error);
      throw error;
    }
  }

  public getRegistration(): ServiceWorkerRegistration | null {
    return this.registration;
  }
}

// Global instance
export const serviceWorkerManager = new ServiceWorkerManager();
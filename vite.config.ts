import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          crypto: ['./src/utils/crypto.ts', './src/utils/chacha20.ts'],
          components: [
            './src/components/Header.tsx',
            './src/components/NoteCard.tsx',
            './src/components/NoteEditor.tsx'
          ]
        }
      }
    }
  },
  server: {
    headers: {
      'Service-Worker-Allowed': '/'
    }
  }
});
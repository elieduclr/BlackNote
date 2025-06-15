import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Initialize Service Worker for offline functionality
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    console.log('[Main] Initializing BlackNote.js v2.0.2 with offline support');
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
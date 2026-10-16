import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

// Global defensive guard against browser extension / external script crashes (e.g. onUpdate-profile)
if (typeof window !== 'undefined') {
  (window as unknown as { profile: Record<string, unknown> }).profile =
    (window as unknown as { profile: Record<string, unknown> }).profile || {
      name: 'Metehan Gezer',
      role: 'Veri Analisti Adayı',
    };

  window.addEventListener(
    'error',
    (event: ErrorEvent) => {
      if (
        event.message?.includes("'profile'") ||
        event.message?.includes('onUpdate-profile') ||
        (event.filename && event.filename.includes('profile'))
      ) {
        event.preventDefault();
        event.stopImmediatePropagation();
        console.warn('[Handled & Suppressed External Profile Error]:', event.error || event.message);
      }
    },
    true
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);


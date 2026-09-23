import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import 'leaflet/dist/leaflet.css';
import './index.css';

import { App } from '@/app/App';
import { ErrorBoundary } from '@/app/ErrorBoundary';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element #root not found in index.html');
}

createRoot(rootElement).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);

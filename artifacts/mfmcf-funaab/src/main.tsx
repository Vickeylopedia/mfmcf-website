import { createRoot } from 'react-dom/client';

import App from './App';
import { ErrorBoundary } from '@/components/error-boundary';
import { setBaseUrl } from '@workspace/api-client-react';

import './index.css';

// Direct production requests to live Render backend
const defaultApiUrl =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD ? "https://mfmcf-funaab-api.onrender.com" : "");
if (defaultApiUrl) {
  setBaseUrl(defaultApiUrl);
}

createRoot(document.getElementById('root')!, {
  // Keeps caught errors off reportError(), which would raise the dev overlay.
  onCaughtError: (error, errorInfo) => {
    console.error(error, errorInfo.componentStack);
  },
}).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>,
);

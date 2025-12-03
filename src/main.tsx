import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider, initializeApiClient } from 'astrogators-shared-ui';
import 'astrogators-shared-ui/styles';
import App from './App';

// Build API base URL from environment variables
const apiHost = import.meta.env.VITE_ASTROGATORS_TABLE_HOST || 'localhost';
const apiPort = import.meta.env.VITE_ASTROGATORS_TABLE_PORT || '80';
const apiBaseURL = apiPort === '80' || apiPort === '443'
  ? `http://${apiHost}`
  : `http://${apiHost}:${apiPort}`;

// Initialize API client
initializeApiClient({
  baseURL: apiBaseURL,
  onUnauthorized: () => {
    window.location.href = '/login';
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);

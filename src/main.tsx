import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from 'astrogators-shared-ui';
import 'astrogators-shared-ui/styles';
import App from './App';

// Get API base URL from environment
// Defaults to nginx proxy path for development
const apiBaseURL = import.meta.env.VITE_ASTROGATORS_TABLE_URL || 'http://localhost/astrogators-table';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider apiBaseUrl={apiBaseURL}>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);

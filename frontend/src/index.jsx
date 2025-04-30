import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';

// Use createRoot API for React 18
const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

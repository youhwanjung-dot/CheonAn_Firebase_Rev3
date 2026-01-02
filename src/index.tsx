import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css'; 
import App from './App';

const container = document.getElementById('root');

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const root = (container as any)._reactRootContainer ?? createRoot(container!);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { captureAttribution } from './lib/track';
import './index.css';

captureAttribution();

const root = document.getElementById('root')!;
// The prerendered crawlable shell is replaced by the app on mount.
root.replaceChildren();
createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

import { Suspense, lazy } from 'react';
import { createRoot } from 'react-dom/client'
import './index.css'

const App = lazy(() => import('./App'));

createRoot(document.getElementById("root")!).render(
  <Suspense fallback={
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      background: 'linear-gradient(to bottom, #0a0a0a, #1a1a1a)'
    }}>
      <div style={{
        width: '48px',
        height: '48px',
        border: '4px solid rgba(212, 175, 55, 0.2)',
        borderTop: '4px solid #d4af37',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }}></div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  }>
    <App />
  </Suspense>
);
// src\main.tsx
// This file is the main entry point of the application
// It sets up the main layout, theme, and sections of the portfolio

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// This is the main entry point of the application
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// vite.config.ts
// This file is used to configure Vite, a build tool for modern web applications

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})

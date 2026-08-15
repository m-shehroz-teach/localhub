import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  define: {
    // Exposes 'global' for simple-peer compatibility in browser environments
    global: 'window',
  },
  server: {
    host: '0.0.0.0',
    port: 5173
  }
});
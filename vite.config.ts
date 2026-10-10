import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Minimal Vite config for Phase 01. Future phases may add aliases, env vars, or test runners.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: false,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});


import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // This allows the app to access process.env without crashing in browser
    'process.env': {}
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
});

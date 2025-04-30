
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Use standard Vite hashes instead of timestamps to maintain consistency
    rollupOptions: {
      output: {
        entryFileNames: `assets/[name].[hash].js`,
        chunkFileNames: `assets/[name].[hash].js`,
        assetFileNames: `assets/[name].[hash].[ext]`,
      }
    }
  },
  server: {
    port: 3000,
    host: '0.0.0.0',
    allowedHosts: ['.replit.dev', '.repl.co'],
  }
});

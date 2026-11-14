import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Redirige /api al servidor simulado (npm run api) para evitar problemas de CORS.
    proxy: {
      '/api': {
        target: `http://localhost:${process.env.API_PORT ?? 3000}`,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});

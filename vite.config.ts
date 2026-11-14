import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import type { Plugin } from 'vite';

const apiPort = Number(process.env.API_PORT ?? 3000);

// Levanta la API simulada junto con `npm run dev`, salvo que se apunte a un backend real (VITE_API_URL).
function mockApi(): Plugin {

  return {
    name: 'buen-origen-mock-api',
    apply: 'serve',
    async configureServer() {

      if (process.env.VITE_API_URL) return;

      // @ts-expect-error módulo JavaScript sin tipos
      const { startApi } = await import('./server/index.mjs');

      await startApi(apiPort);
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), mockApi()],
  server: {
    // Redirige /api al servidor simulado para evitar problemas de CORS.
    proxy: {
      '/api': {
        target: `http://localhost:${apiPort}`,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});

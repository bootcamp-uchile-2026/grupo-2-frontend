import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import type { Plugin } from 'vite';

const apiPort = Number(process.env.API_PORT ?? 3100);

// Levanta la API simulada de server/index.mjs, que replica el contrato de grupo-2-backend.
function mockApi(): Plugin {

  return {
    name: 'buen-origen-mock-api',
    apply: 'serve',
    async configureServer() {

      const { startApi } = await import('./server/index.mjs');

      await startApi(apiPort);
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), mockApi()],
  server: {
    // Redirige /api a la API simulada para evitar problemas de CORS.
    proxy: {
      '/api': {
        target: `http://localhost:${apiPort}`,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});

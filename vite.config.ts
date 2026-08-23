import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Plugin middleware para responder a /api/pqrs durante el desarrollo local en Vite
const apiLocalDevPlugin = (): Plugin => ({
  name: 'api-local-dev-plugin',
  configureServer(server) {
    server.middlewares.use('/api/pqrs', (_req, res) => {
      try {
        const filePath = path.resolve(__dirname, 'data', 'pqrs.json');
        if (fs.existsSync(filePath)) {
          const rawData = fs.readFileSync(filePath, 'utf-8');
          res.setHeader('Content-Type', 'application/json; charset=utf-8');
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.statusCode = 200;
          res.end(rawData);
        } else {
          res.setHeader('Content-Type', 'application/json');
          res.statusCode = 404;
          res.end(JSON.stringify({ error: 'data/pqrs.json no encontrado' }));
        }
      } catch (error) {
        res.setHeader('Content-Type', 'application/json');
        res.statusCode = 500;
        res.end(JSON.stringify({ 
          error: 'Error interno al leer archivo de PQRS',
          details: error instanceof Error ? error.message : String(error)
        }));
      }
    });
  }
});

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), apiLocalDevPlugin()],
  server: {
    port: 5173,
    // Configuración de proxy para desarrollo local
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
        ws: true,
      }
    }
  }
});

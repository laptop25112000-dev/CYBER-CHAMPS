import { resolve } from 'path'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// Base path: '/' for local dev and Vercel, '/CYBER-CHAMPS/' for GitHub Pages
export default defineConfig(({ command }) => {
  const isDev = command === 'serve';
  const isVercel = Boolean(process.env.VERCEL) || process.env.NOW_BUILDER !== undefined;
  const base = process.env.VITE_BASE || (isDev || isVercel ? '/' : '/CYBER-CHAMPS/');

  return {
    base,
    plugins: [react(), tailwindcss()],
    server: {
    host: true,
    proxy: {
      '/sim-proxy': {
        target: 'https://hyperdrive-sim.vercel.app',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/sim-proxy/, ''),
        headers: {
          'Origin': 'https://hyperdrive-sim.vercel.app',
          'Referer': 'https://hyperdrive-sim.vercel.app/'
        },
        configure: (proxy) => {
          proxy.on('proxyRes', (proxyRes) => {
            delete proxyRes.headers['x-frame-options'];
            delete proxyRes.headers['content-security-policy'];
          });
        },
      },
      '/onshape-proxy': {
        target: 'https://cad.onshape.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/onshape-proxy/, ''),
        headers: {
          'Origin': 'https://cad.onshape.com',
          'Referer': 'https://cad.onshape.com/'
        },
        configure: (proxy) => {
          proxy.on('proxyRes', (proxyRes) => {
            delete proxyRes.headers['x-frame-options'];
            delete proxyRes.headers['content-security-policy'];
          });
        },
      },
    },
  },
    build: {
      rollupOptions: {
        input: {
          main: resolve(import.meta.dirname, 'index.html'),
          tearable: resolve(import.meta.dirname, 'tearable.html'),
        },
      },
    },
  };
});

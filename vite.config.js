import { resolve } from 'path'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// Base path: '/' when building on Vercel (or when VERCEL or VITE_BASE is specified),
// otherwise '/CYBER-CHAMPS/' for GitHub Pages
const isVercel = Boolean(process.env.VERCEL) || process.env.NOW_BUILDER !== undefined;
const base = process.env.VITE_BASE || (isVercel ? '/' : '/CYBER-CHAMPS/');

// https://vite.dev/config/
export default defineConfig({
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
})

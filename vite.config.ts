import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const isProduction = mode === 'production';

  return {
    plugins: [
      react()
    ],
    server: {
      host: '0.0.0.0',
      port: 3000,
      allowedHosts: true,
      proxy: {
        '/api': {
          target: process.env.VITE_PROXY_TARGET || 'http://app:3002',
          changeOrigin: true,
          secure: false,
          configure: (proxy, options) => {
            proxy.on('error', (err, req, res) => {
              console.log('proxy error', err);
            });
            proxy.on('proxyReq', (proxyReq, req, res) => {
              console.log('Sending Request to the Target:', req.method, req.url);
            });
            proxy.on('proxyRes', (proxyRes, req, res) => {
              console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
            });
          },
        }
      },
      watch: {
        usePolling: true,
        interval: 1000,
      },
      headers: {
        'Cache-Control': 'no-store',
      },
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        ".prisma/client/index-browser": "./node_modules/.prisma/client/index-browser.js"
      },
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json']
    },
    define: {
      'process.env': Object.entries(env).reduce((prev, [key, val]) => {
        return {
          ...prev,
          [key]: JSON.stringify(val)
        }
      }, {})
    },
    build: {
      outDir: 'dist/frontend',
      assetsDir: 'assets',
      sourcemap: !isProduction,
      minify: isProduction ? 'esbuild' : false,
      chunkSizeWarningLimit: 2000,
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom', 'react-router-dom'],
            'ui': ['@radix-ui/react-dialog', '@radix-ui/react-select', '@radix-ui/react-tabs'],
            'utils-vendor': ['axios', 'date-fns', 'sonner'],
          }
        }
      },
      target: 'esnext',
      assetsInlineLimit: 4096,
      emptyOutDir: false,
      commonjsOptions: {
        include: [/node_modules/],
        extensions: ['.js', '.cjs', '.ts', '.tsx'],
        transformMixedEsModules: true
      }
    },
    optimizeDeps: {
      include: ['react', 'react-dom', 'react-router-dom'],
      exclude: ['@prisma/client']
    },
    clearScreen: false,
    logLevel: 'info'
  }
});

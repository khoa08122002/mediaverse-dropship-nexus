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
      port: 3000,
      proxy: {
        '/api': {
          target: 'http://localhost:3002',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, '')
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
      outDir: 'dist',
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
      emptyOutDir: true,
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

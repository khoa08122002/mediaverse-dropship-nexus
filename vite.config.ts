import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      include: "**/*.{jsx,tsx}",
      babel: {
        plugins: ["@babel/plugin-transform-react-jsx"],
      },
      jsxRuntime: 'automatic',
      jsxImportSource: 'react',
    }),
  ],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:3002',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''),
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
    },
  },
  define: {
    'process.env': {},
  },
  build: {
    sourcemap: true,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('react')) return 'react-vendor';
            if (id.includes('radix-ui')) return 'ui-vendor';
            if (id.includes('@splinetool')) return 'spline-vendor';
            return 'vendor';
          }
        },
      },
    },
    chunkSizeWarningLimit: 2000,
    target: 'esnext',
    assetsInlineLimit: 4096,
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'lucide-react',
      'sonner',
      '@tanstack/react-query',
      '@splinetool/react-spline'
    ],
    exclude: [],
    force: true,
    esbuildOptions: {
      target: 'esnext',
    }
  },
  clearScreen: false,
  logLevel: 'info',
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' }
  }
});

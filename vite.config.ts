import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
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
          target: env.VITE_API_URL || 'http://localhost:3002',
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
      sourcemap: true,
      minify: 'esbuild',
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks: {
            'react-core': ['react', 'react-dom', 'react-router-dom'],
            'ui-core': ['@radix-ui/react-dialog', '@radix-ui/react-slot', '@radix-ui/react-label'],
            'ui-utils': ['lucide-react', 'sonner', '@tanstack/react-query'],
            'spline-core': ['@splinetool/runtime'],
            'spline-utils': ['@splinetool/react-spline'],
          },
          assetFileNames: 'assets/[name]-[hash][extname]',
          chunkFileNames: 'assets/[name]-[hash].js',
          entryFileNames: 'assets/[name]-[hash].js',
        },
      },
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
      ],
      exclude: ['@splinetool/runtime', '@splinetool/react-spline'],
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
  }
});

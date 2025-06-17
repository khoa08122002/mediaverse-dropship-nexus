import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const isProduction = mode === 'production';

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
        ".prisma/client/index-browser": "./node_modules/.prisma/client/index-browser.js",
        "react": path.resolve(__dirname, "./node_modules/react"),
        "react-dom": path.resolve(__dirname, "./node_modules/react-dom")
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
      sourcemap: !isProduction,
      minify: isProduction ? 'esbuild' : false,
      chunkSizeWarningLimit: 2000,
      rollupOptions: {
        external: ['react', 'react-dom'],
        output: {
          manualChunks: (id) => {
            if (id.includes('node_modules')) {
              if (id.includes('react') || id.includes('scheduler') || id.includes('prop-types')) {
                return 'react-vendor';
              }
              if (id.includes('@radix-ui')) return 'radix-vendor';
              if (id.includes('@splinetool')) return 'spline-vendor';
              if (id.includes('lucide-react') || id.includes('sonner') || id.includes('@tanstack/react-query')) {
                return 'utils-vendor';
              }
              return 'vendor';
            }
          },
          assetFileNames: (assetInfo) => {
            if (!assetInfo.name) return 'assets/[name]-[hash][extname]';
            const info = assetInfo.name.split('.');
            const ext = info[info.length - 1];
            if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
              return `assets/images/[name]-[hash][extname]`;
            }
            return `assets/[name]-[hash][extname]`;
          },
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
        },
      },
      target: 'esnext',
      assetsInlineLimit: 4096,
      emptyOutDir: true,
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
      exclude: [
        '@splinetool/runtime',
        '@splinetool/react-spline',
        '@prisma/client'
      ],
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

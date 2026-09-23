/// <reference types="vitest/config" />
import { fileURLToPath, URL } from 'node:url';

import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    tailwindcss(),
    // `npm run analyze` → dist/stats.html with the gzip size of every module.
    // Uses --mode rather than an env variable so the command works the same on Windows and Unix.
    mode === 'analyze' && visualizer({ filename: 'dist/stats.html', gzipSize: true, open: true }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
    server: {
      deps: {
        // mgrs ships UMD in `main` and ESM in `module` but no `exports`. Node in Vitest picks the UMD
        // build and cannot see the named `forward`; inlining makes Vite process it like the browser build.
        inline: ['mgrs'],
      },
    },
  },
}));

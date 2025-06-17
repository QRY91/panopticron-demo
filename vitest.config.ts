// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';


export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './vitest.setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      reportsDirectory: './coverage'
    },
    // ssr specific options are NOT here for Vitest 1.x+
  },
  resolve: {
    dedupe: ["react", "react-dom", "@mui/material"],
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@interfaces': path.resolve(__dirname, './src/interfaces'),
      '@providers': path.resolve(__dirname, './src/providers'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@contexts': path.resolve(__dirname, './src/contexts'),
      '@themes': path.resolve(__dirname, './src/themes'),
      '@services': path.resolve(__dirname, './src/services'),
      '@types': path.resolve(__dirname, './src/types')
    },
  },
  // SSR options are at the root level for Vitest 1.x+
  ssr: {
    noExternal: [
      /@mui\/.*/,
      /@refinedev\/.*/,
    ],
  },
});
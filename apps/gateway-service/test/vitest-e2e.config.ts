import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    // 1. Tell Vitest where to find your E2E tests
    include: ['**/*.e2e-spec.ts'],
    // 2. Enable globals so you don't have to import 'describe', 'it', etc.
    globals: true,
    // 3. Set the environment to node (important for NestJS)
    environment: 'node',
    // 4. Handle path aliases (if you use @/ or src/ in your imports)
    alias: {
      src: path.resolve(__dirname, './src'),
    },
    // 5. Ensure the root is the current directory
    root: './',
  },
  plugins: [
    // This is the "magic" that makes NestJS decorators work
    swc.vite({
      module: { type: 'es6' },
    }),
  ],
});

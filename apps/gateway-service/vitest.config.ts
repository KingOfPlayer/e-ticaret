import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true, // This allows you to use 'describe', 'it', 'expect' without importing them
    root: './',
  },
  plugins: [
    // This is the magic part that makes NestJS decorators work
    swc.vite({
      module: { type: 'es6' },
    }),
  ],
});

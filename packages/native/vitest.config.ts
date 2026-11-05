import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  test: { environment: 'node', globals: true },
  resolve: {
    alias: {
      'react-native-svg': fileURLToPath(new URL('./test/svg-mock.ts', import.meta.url)),
      'react-native': fileURLToPath(new URL('./test/rn-mock.ts', import.meta.url)),
    },
  },
});

import path from 'path';
import { defineConfig } from 'vite';
import banner from 'vite-plugin-banner';
import pkg from './package.json';

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'WeeFetch',
      formats: ['es', 'cjs'],
      fileName: (format) => `${pkg.name}.${format}.js`,
    },
    rollupOptions: {
      external: ['cross-fetch'],
    },
  },
  plugins: [banner(`${pkg.name} v${pkg.version} - ${pkg.homepage}`)],
});

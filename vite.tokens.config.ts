import { defineConfig } from 'vite'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

/** Build leve: só CSS vars + API runtime de tokens. */
export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: { silenceDeprecations: ['import', 'legacy-js-api'] },
    },
  },
  build: {
    target: 'es2020',
    cssCodeSplit: false,
    minify: 'esbuild',
    emptyOutDir: false,
    lib: {
      entry: resolve(__dirname, 'src/tokens/export.ts'),
      formats: ['es'],
      fileName: () => 'tokens.es.js',
    },
    rollupOptions: {
      output: {
        assetFileNames: 'tokens.css',
        inlineDynamicImports: true,
      },
    },
  },
})

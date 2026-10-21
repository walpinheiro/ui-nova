import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [vue()],
  css: {
    preprocessorOptions: {
      scss: { silenceDeprecations: ['import', 'legacy-js-api'] },
    },
  },
  build: {
    target: 'es2020',
    cssCodeSplit: false,
    minify: 'esbuild',
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'VueUiNova',
      formats: ['es', 'umd'],
      fileName: (format) => (format === 'es' ? 'vueui-nova.es.js' : 'vueui-nova.umd.cjs'),
      cssFileName: 'vueui-nova-kit',
    },
    rollupOptions: {
      external: ['vue'],
      output: [
        {
          format: 'es',
          entryFileNames: 'vueui-nova.es.js',
          exports: 'named',
        },
        {
          format: 'umd',
          entryFileNames: 'vueui-nova.umd.cjs',
          name: 'VueUiNova',
          exports: 'named',
          globals: { vue: 'Vue' },
        },
        {
          format: 'umd',
          entryFileNames: 'vueui-nova.umd.js',
          name: 'VueUiNova',
          exports: 'named',
          globals: { vue: 'Vue' },
        },
      ],
      treeshake: {
        preset: 'recommended',
        moduleSideEffects: (id) =>
          id.endsWith('.css') || id.endsWith('.scss') || id.endsWith('.sass'),
        propertyReadSideEffects: false,
      },
    },
  },
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { fileURLToPath } from 'url'

const filesNeedToExclude = ['image-test/*']

const filesPathToExclude = filesNeedToExclude.map((src) => {
  return fileURLToPath(new URL(src, import.meta.url))
})

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  build: {
    rollupOptions: {
      // https://stackoverflow.com/a/75480206
      external: filesPathToExclude
    }
  },
  optimizeDeps: {
    exclude: ['@electric-sql/pglite']
  },
  worker: {
    // https://github.com/vitejs/vite/issues/18585#issuecomment-2458919919
    format: 'es'
  }
})

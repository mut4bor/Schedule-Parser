import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import pluginChecker from 'vite-plugin-checker'
import path from 'path'

export default defineConfig({
  plugins: [react(), pluginChecker({ typescript: true })],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    open: true,
  },
  css: {
    modules: {
      generateScopedName: '[name]__[local]___[hash:base64:5]',
    },
  },
})

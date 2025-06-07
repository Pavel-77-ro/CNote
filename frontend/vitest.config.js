/* eslint-env node */
import { fileURLToPath, URL } from 'url'
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],

  // map '@' → '<projectRoot>/src' using import.meta.url
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },

  test: {
    environment: 'happy-dom',
    globals: true,
    // remove any setupFiles entry if it was causing trouble
    coverage: {
      reporter: ['text', 'html'],
      exclude: ['tests/**', 'src/main.js'],
    },
  },
})

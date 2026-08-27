// simulation-2/vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // Served at exhibition.awalkaday.art/simulation-2/, not the domain root —
  // asset URLs need this or they'll resolve against the Jekyll site instead.
  base: '/simulation-2/',
  plugins: [react()],
})

// simulation-2/vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // Served at exhibition.awalkaday.art/simulation-2/, not the domain root —
  // asset URLs need this or they'll resolve against the Jekyll site instead.
  base: '/simulation-2/',
  build: {
    // Outside simulation-2/ on purpose: the deploy workflow deletes the source
    // folder and replaces it with this output (see deploy.yml) — an outDir
    // nested inside the folder it's about to delete would delete itself.
    outDir: '../simulation-2-build',
    emptyOutDir: true,
  },
  plugins: [react()],
})

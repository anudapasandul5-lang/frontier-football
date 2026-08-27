import { defineConfig } from 'vite'
import { resolve } from 'node:path'

// Root deploy (Vercel, Netlify, custom domain). Set BASE_PATH=/frontier-football/
// if this ever moves to a GitHub Pages project site.
export default defineConfig({
  base: process.env.BASE_PATH ?? '/',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        gallery: resolve(__dirname, 'gallery.html'),
        // Unlisted: nothing links to it, but it still has to be built or the
        // URL the owner sends a brand is a 404.
        partner: resolve(__dirname, 'partner.html'),
        styleguide: resolve(__dirname, 'styleguide.html'),
      },
    },
  },
})

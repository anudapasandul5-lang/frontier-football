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
        album: resolve(__dirname, 'album.html'),
        styleguide: resolve(__dirname, 'styleguide.html'),
      },
    },
  },
})

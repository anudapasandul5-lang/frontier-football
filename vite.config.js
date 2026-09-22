import { defineConfig } from 'vite'
import { resolve } from 'node:path'

// Root deploy (Vercel, Netlify, custom domain). Set BASE_PATH=/frontier-football/
// if this ever moves to a GitHub Pages project site.
export default defineConfig({
  base: process.env.BASE_PATH ?? '/',
  server: {
    // Lets the cloudflared quick-tunnel (random *.trycloudflare.com host
    // each run) through Vite's dev-server host check.
    allowedHosts: ['.trycloudflare.com'],
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'about.html'),
        gallery: resolve(__dirname, 'gallery.html'),
        contact: resolve(__dirname, 'contact.html'),
        collaborate: resolve(__dirname, 'collaborate.html'),
        events: resolve(__dirname, 'events.html'),
        album: resolve(__dirname, 'album.html'),
        styleguide: resolve(__dirname, 'styleguide.html'),
        // Internal design preview, noindex; shared as a Vercel preview URL.
        galleryDirections: resolve(__dirname, 'design-explorations/gallery/index.html'),
      },
    },
  },
})

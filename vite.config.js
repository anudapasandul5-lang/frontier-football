import { defineConfig } from 'vite'

// Root deploy (Vercel, Netlify, custom domain). Set BASE_PATH=/frontier-football/
// if this ever moves to a GitHub Pages project site.
export default defineConfig({
  base: process.env.BASE_PATH ?? '/',
})

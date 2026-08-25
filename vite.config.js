import { defineConfig } from 'vite'

// GitHub Pages serves this at /frontier-football/. Set BASE_PATH=/ for a root
// deploy (Vercel, Netlify, or a custom domain).
export default defineConfig({
  base: process.env.BASE_PATH ?? '/frontier-football/',
})

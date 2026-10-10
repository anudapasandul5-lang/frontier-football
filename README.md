# Frontier Football

Website for Frontier Football, a football and futsal events venture in Sri Lanka.

**Live:** https://frontier-football.vercel.app
**Stack:** Next.js 16, React 19, Tailwind CSS 4. Vercel deploys every push to `main`.

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000
npm test           # Vitest
npm run typecheck
```

## Content scripts

| Command | What it does |
|---|---|
| `npm run albums:sync` | Pulls photo albums from Google Drive |
| `npm run albums:papare` | Imports curated albums from ThePapare |
| `npm run images:phone` | Builds phone-sized image variants |
| `npm run gate:placeholder` | Fails if placeholder content is left in the build |

## Project notes

- `DESIGN.md`: locked visual direction and palette
- `CONTEXT.md`: domain terms and decisions
- `CLAUDE.md` / `AGENTS.md`: instructions for AI coding agents

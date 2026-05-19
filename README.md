# CareChoice Demo

Working demonstration of a redesigned CareChoice website for executive buy-in.

- **Spec:** `../docs/superpowers/specs/2026-05-19-carechoice-demo-design.md`
- **Plan:** `../docs/superpowers/plans/2026-05-19-week-1-foundation.md`

## Stack

- Next.js 15 (App Router) + Payload 3
- Postgres (Neon free tier in demo)
- TypeScript, Tailwind CSS v3, Source Sans 3 (CareChoice brand)
- Salesforce UAT integration (OAuth Client Credentials)
- Deployed to Vercel Hobby

## Local development

```bash
# 1. Copy .env.example to .env.local and fill in values
cp .env.example .env.local
# Edit .env.local — see comments

# 2. Install dependencies (run once)
npm install

# 3. Run dev server
npm run dev
```

Visit:
- http://localhost:3000/ — public site
- http://localhost:3000/admin — Payload admin

## Useful commands

```bash
npm run dev               # Dev server
npm run build             # Production build
npm run start             # Run production build locally
npm run lint              # ESLint (including jsx-a11y)
npm run test:int          # Vitest integration tests
npm run test:e2e          # Playwright e2e
npm run lh                # Lighthouse CI (requires polished build)
npm run generate:types    # Regenerate Payload types from collections + globals
npm run generate:importmap
```

## Environment variables

See `.env.example` for the full list. Required:
- `DATABASE_URL` — Neon Postgres connection string
- `PAYLOAD_SECRET` — random 32+ char string
- `SALESFORCE_*` — UAT Connected App credentials

## Salesforce schema

Discovery and field reference: `docs/salesforce-schema.md`

## Brand

CareChoice Design System v1.0 — see `../design-reference/carechoice-design-system/README.md`.

Three documented WCAG 2.2 AA adaptations from the brand spec are commented inline in `src/styles/tokens.css` (search `A11Y-ADAPT`).

## Locale routing

Currently a placeholder. `src/middleware.ts` detects `/`, `/vi/...`, `/zh/...`, `/easy-read/...` and sets an `x-locale` header that pages read via `next/headers`. Full localized routing (with `[locale]` segments rendering Payload content per locale) lands in Plan 2.

## Demo deployment

- URL: `https://carechoice-demo.vercel.app` (when Task 35 is complete)
- Hosting: Vercel Hobby (non-commercial)
- Database: Neon free tier (0.5GB, scales to zero)
- Demo software cost: **$0**

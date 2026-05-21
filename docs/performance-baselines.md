# Performance baselines

End of Week 5 — recorded 2026-05-21 against the production deployment at
`https://care-choice-website-demo.vercel.app/`.

## Lighthouse scores (production, mobile, 1 run each)

| Page | Performance | Accessibility | Best Practices | SEO |
|---|---|---|---|---|
| /en | 87 | 94 | 96 | 100 |
| /en/find-a-home | 76 | 94 | 96 | 100 |
| /en/services/supported-independent-living | 89 | 95 | 96 | 100 |
| /en/case-studies | 93 | 96 | 96 | 100 |

Three of four pages clear Perf >= 85. `/find-a-home` is the outlier at 76 — see
"Areas to revisit" below.

## Improvements made in Week 5

- **next/font subsetting on Source Sans 3** (Task 20) — replaces the manual
  `@font-face` block plus the hosted TTFs; ships preloaded, subsetted woff2 with
  `font-display: swap` and a CSS variable (`--cc-font-sans-loaded`) wired into
  `--cc-font-sans` in `tokens.css`. OpenDyslexic stays on its CDN unchanged
  because it's only loaded when the user opts in via the a11y toolbar.
- **`generateStaticParams` for Services / CaseStudies / News routes** (Task 14)
  — more detail pages render statically at build time, improving TTFB and
  giving Pagefind more content to index.
- **`next/image priority` audit** (Task 21) — confirmed correct: hero images
  (`Header` brand logo, `CaseStudyHero`, `SDAHeroGallery`) carry `priority`;
  below-fold card thumbnails (`CaseStudyCard`, `SDAHomeCard`, `SDAPreviewRow`)
  do not. All `fill` images carry sensible `sizes` props matching layout
  breakpoints. No code changes were needed.
- **`@next/bundle-analyzer` added** (Task 22) — run `npm run analyze` to inspect
  the bundle. Note: Next 16's default Turbopack production build is not yet
  compatible with the analyzer, so the analyze script passes `--webpack` to
  force the webpack pipeline for inspection only. Production builds and Vercel
  deploys still use Turbopack.

## Bundle analysis findings

Captured from `npm run analyze` → `.next/analyze/client.html`.

Top client chunks (parsed / gzip):

| Size (parsed) | Gzip | Chunk | Notes |
|---|---|---|---|
| 736 KB | 233 KB | `@payloadcms/ui/dist/exports/client/index.js` | **admin-only** — loaded by `/admin` routes only, not the public site |
| 335 KB | 83 KB | `@payloadcms/ui` chunk (`WDZJLNNB`) | admin-only |
| 195 KB | 61 KB | `react-dom-client.production.js` (compiled) | unavoidable React runtime |
| 171 KB | 54 KB | `react-dom-client.production.js` (framework) | unavoidable React runtime |
| 145 KB | 41 KB | `leaflet/dist/leaflet-src.js` | SDA map; deferred via dynamic import on `/find-a-home` |
| 39 KB | 13 KB | `@dnd-kit/core` | admin-only (Payload UI dependency) |
| 26 KB | 8 KB | `tailwind-merge` | used by `cn()` helper site-wide |

Key observations:

- The two largest client chunks (`@payloadcms/ui` at 736 KB + 335 KB) only ship
  to the `/admin` route; the public site never loads them. They show up as
  "biggest" in absolute size but do not affect public-page perf.
- Leaflet (145 KB) is the largest dependency on a public page. It's already
  loaded via dynamic import on `/find-a-home` (see `SDAGridMapToggle.tsx`).
- No unexpectedly large bundles on public routes. `react-dom` and the Next
  framework chunks dominate the rest, which is normal for a Next 16 + React 19
  app.

## Areas to revisit in Plan 6

`/find-a-home` at Perf=76 is the only page below 85. Lighthouse opportunities:

- `redirects` (~770 ms) — Vercel is doing one or more redirects on first load
  (probably www / locale negotiation). Worth investigating in Plan 6.
- `uses-http2` (~500 ms) — depends on the Vercel edge config; usually not
  actionable from app code.
- `render-blocking-resources` (~450 ms) — likely the Leaflet CSS and the
  JetBrains Mono Google Fonts import in `tokens.css`. Could be deferred or
  self-hosted.
- `unused-javascript` (~150 ms) and `legacy-javascript` (~150 ms) — small.

Speed Index on `/find-a-home` is 8.3 s (score 0.19), but TBT is 0 and CLS is
0.004 — the page is interactive quickly, it just has a lot of map tiles and
home photos painting. Lazy-loading more aggressively below the fold is the
likely fix.

Other things to revisit if perf becomes a focus:

- Self-host JetBrains Mono via `next/font/google` (or `local`) to remove the
  Google Fonts CSS import in `tokens.css`.
- Audit the Leaflet/react-leaflet pair — react-leaflet itself adds wrapper
  weight; raw Leaflet via a ref might be lighter for a one-off map view.

## How to re-run

```powershell
# Lighthouse against prod
npx lhci collect --url=https://care-choice-website-demo.vercel.app/en/ --url=https://care-choice-website-demo.vercel.app/en/find-a-home --url=https://care-choice-website-demo.vercel.app/en/services/supported-independent-living --url=https://care-choice-website-demo.vercel.app/en/case-studies --numberOfRuns=1
npx lhci open

# Bundle analyser (writes HTML to .next/analyze/)
npm run analyze
Start-Process .next/analyze/client.html
```

---

## Search engine decision (end of Plan 5)

**Decision: Stay on Pagefind for the demo. Re-evaluate after Rehearsal #3.**

### Why stay

- Pagefind covers the search beat (Beat 11) at $0 cost
- No external service dependency for demo day
- Index will grow naturally as content team publishes more Services / Case Studies / News (Plan 5 Phase D wired `generateStaticParams` so each published doc becomes a statically-rendered page Pagefind indexes)

### What would flip the decision to Algolia

- Rehearsal #3 audience finds "no results for [common query]" jarring
- Pagefind's typo tolerance proves inadequate (e.g. demo audience types "Mt Duneed" not "Mount Duneed")
- Content team can't get 5+ Case Studies and 3+ News items published before demo day

### If we flip

Algolia free tier: 10k searches/month, 10k records. Implementation effort: ~3-4 hours. Steps would be: create Algolia app, push records via Payload webhook on publish, swap SearchUI to use `algoliasearch-lite` (~7KB client) instead of Pagefind. Plan 6 scope.

## Plan 6 perf focus

`/en/find-a-home` is the only polished page below 85 (76). Top opportunities to chase:
- Redirects (770 ms) — likely the trailing-slash → no-slash normalisation that Vercel adds. Audit and tighten.
- Render-blocking resources (450 ms) — JetBrains Mono Google Fonts import + Leaflet CSS. Self-host JetBrains Mono via next/font; consider deferring Leaflet CSS to only render on map-view toggle.
- HTTP/2 multiplexing (500 ms) — Vercel default; investigate config.

Speed Index (8.3 s) reflects many SDA cards painting in parallel. Considerations: skeleton/blur placeholders for SDA card images; smaller image sizes for grid view.

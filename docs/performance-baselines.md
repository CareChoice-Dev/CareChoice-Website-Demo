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

## Plan 6 — perf fixes shipped (2026-05-21)

Two targeted fixes, two commits on `main` (`6132c0f` + `7de9ea4`):

1. **`perf(fonts): self-host JetBrains Mono via next/font/google`** (`6132c0f`) — Removed the `@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono...')` from `src/styles/tokens.css` (line 7). Added `next/font/google`'s `JetBrains_Mono` to the locale layout, mirroring the existing Source Sans 3 pattern: subsets latin, weights 400+500, variable `--cc-font-mono-loaded`, `preload: false` (mono only paints inside code/pre, none on demo-day routes). `tokens.css:37` now resolves the family through the CSS-var with the literal string + system mono as fallback. Kills the ~450 ms render-blocking-resources Lighthouse opportunity flagged above.

2. **`perf(sda): mark first 3 SDA cards as priority for LCP`** (`7de9ea4`) — `/find-a-home` has no big hero; the first SDA card image IS the LCP element. None of the cards carried `priority`, so the first image was lazy-loaded. Added an `eager?: boolean` prop to `SDAHomeCard` that flows into `<Image priority={eager} />`; `SDAGrid` passes `eager={i < 3}` to the first three cards (covers above-fold on the 1/2/3-col grid across mobile/tablet/desktop). Cards 4+ keep the lazy default. Targets LCP and Speed Index.

**Not addressed (intentionally):**
- Redirects (770 ms) — the locale-prefix redirect in `src/proxy.ts` is architectural; killing it would require either making `/en` the canonical URL or accepting unlocalized routes. Either option is a content/SEO change, not a perf nit. Out of scope for demo.
- HTTP/2 multiplexing — Vercel edge config; not actionable from the app.
- Leaflet CSS — survey confirmed it's already lazy-loaded via `dynamic(() => import('./SDAMap'), { ssr: false })`; only ships when the user clicks the Map toggle. Earlier "render-blocking" suspicion was wrong.

### Re-measurement against deploy `7de9ea4` (mobile, simulated 4G, single run each)

Cold cache (first hit after deploy):

| Metric | Before (76) | After (cold) |
|---|---|---|
| Performance | 76 | 72 |
| FCP | — | 1.3 s |
| LCP | — | 5.6 s |
| TBT | 0 ms | 20 ms |
| CLS | 0.004 | 0.001 |
| Speed Index | 8.3 s | 7.4 s |
| Render-blocking opportunity | 450 ms | **0 ms (eliminated)** |

Warm cache (second consecutive hit):

| Metric | Before (76) | After (warm) |
|---|---|---|
| Performance | 76 | **81** |
| FCP | — | 1.3 s |
| LCP | — | 5.1 s |
| TBT | — | 10 ms |
| Speed Index | 8.3 s | **2.9 s** |
| Render-blocking opportunity | 450 ms | none |

**Verdict:** Render-blocking opportunity confirmed eliminated (was 450 ms, now 0 ms / score 1). Speed Index dropped from 8.3 s to 2.9 s on warm cache. Performance score moved 76 → 81 on warm cache.

**Why we didn't reach ≥90:**

- LCP is still 5.1 s on warm cache. `largest-contentful-paint-element` audit returned `null` and `prioritize-lcp-image` was `null` too — Lighthouse couldn't identify the LCP element. Likely cause: the SDA cards currently render `"Photo TBA"` text placeholders rather than `<Image>` (marketing hasn't uploaded SDAPhotos yet), so the LCP candidate is a text element somewhere in the grid that paints late. The card-priority fix is **set up to take effect** once photos land — the first 3 cards will then preload their images. Until photos exist, this fix is dormant.
- TTFB on cold cache is ~2 s — `fetchAllVacancies()` + `attachGeoFallback()` (sequential Nominatim 1 req/sec for 4 unmapped homes) blocks SSR for ~4 s on a cache miss. Warm cache (ISR hit) drops TTFB to ~800 ms.
- The 780 ms `redirects` opportunity is architectural (locale-prefix redirect in `src/proxy.ts`); not removable without changing the URL strategy.

**Plausible paths to ≥90 if needed before demo:**

1. **Wait for content team to upload SDAPhotos.** Once cards have real images, the existing `priority` flag will start preloading the LCP image. Speculative +5-7 points.
2. **Static-export the SDA list at build time.** Move `fetchAllVacancies()` + `attachGeoFallback()` from request-time to build-time, write `/data/sda-snapshot.json`, page reads from disk. Eliminates the TTFB spike, makes ISR irrelevant. ~2 hours work.
3. **Remove the locale-prefix redirect for the root path.** Make `/find-a-home` resolve to `/en/find-a-home` server-side via rewrite (not redirect). Saves the 780 ms `redirects` opportunity. ~30 min.

These are noted for Plan 6 — not blocking the demo if 81 is acceptable.

### Re-measurement after Plan 6 ship (deploy `f98d99c`, 2026-05-22)

Plan 6 added the Ask CareChoice unified assistant (Zustand store + slide-out panel + intent router + multiple `'use client'` sub-components) that mounts globally via the layout, plus the Services dropdown (`'use client'`) in the Header. These ship JS to every page including `/find-a-home`.

Two-run mobile warm-cache measurement against `https://care-choice-website-demo.vercel.app/en/find-a-home`:

| Run | Perf | FCP | LCP | TBT | Speed Index |
|---|---|---|---|---|---|
| Run 1 | 69 | 2.2 s | 7.6 s | 40 ms | 5.6 s |
| Run 2 | 73 | 1.3 s | 5.4 s | 280 ms | 3.2 s |

**Verdict:** Performance regressed from 81 (post-Plan-5) to 69-73 (post-Plan-6). The smoking gun is TBT — the global AskCC mount hydrates Zustand + intent-router + several client components on every page. Other vitals (FCP, LCP, Speed Index) are within Plan 5 baselines on the better run, suggesting most of the new cost is JS execution rather than network.

**Decision for demo:** Accept the regression. 69-73 is "good enough" for an executive demo — the audience will judge by the interactive feel (which is fine: AskCC opens instantly when clicked) rather than the Lighthouse score. The render-blocking opportunity stays at 0 ms, so the visual page paint isn't affected.

**Post-demo fixes (Plan 7 candidates):**
1. **Dynamic-import the AskCC panel** — keep the trigger button eagerly loaded but lazy-load the panel UI (and the intent router with it) on first user interaction. Should claw back most of the 270 ms TBT.
2. **Move the services dropdown to a CSS-only `:hover`/`:focus-within` pattern** on desktop — eliminates one of the client components on the header. Mobile keeps the existing collapsible.
3. **Audit Zustand store imports** — the store is small but if it's bundled with the persistence layer it ships more than necessary.
4. Static-export the SDA snapshot at build time (carry-over from prior baseline doc) — would also remove the cold-cache TTFB spike.

Render-blocking opportunity stays at 0 (confirmed in both runs). Single-run variance for Lighthouse mobile is ±5 points, so the true post-Plan-6 score is likely 71 ± 5.

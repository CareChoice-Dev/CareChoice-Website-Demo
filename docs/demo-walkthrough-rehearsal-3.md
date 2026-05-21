# Demo Walkthrough — Rehearsal #3 (Final Dress)

**Target duration:** 20-22 minutes
**Pages covered:** All 12 beats from spec §12
**Base URL:** https://care-choice-website-demo.vercel.app

---

## Opening (90s)

(Same framing as previous rehearsals.) "Five weeks in, six weeks total. All 12 demo beats functional, including the Salesforce write, Agentforce chat, search, and AI-driven content. Let's walk through."

---

## Beat 1 — Homepage (90s)

Pause on hero, audience pathways, SDA preview row (live from Salesforce), services, case study spotlight, stats, news, footer. Highlight the brand voice rule (full stops on headlines, no emoji).

## Beat 2 — Audience pathways (45s)

Already touched in Beat 1; underline the "three doors above the fold resolves the 11-item nav" point.

## Beat 3 — SDA Listings with map (2 min)

Open Salesforce side-by-side. Filter by region. Toggle to map view (OSM tiles, geocoded via Nominatim — no Google Maps key). Click a marker, view a home.

## Beat 4 — SDA Home detail (2 min)

Hero gallery (if marketing has uploaded photos via Payload SDAPhotos — point this out: "These photos came from marketing, not Salesforce. The Salesforce record is the facts; Payload curates the story.")

Accessibility & amenities grid (Lucide icons mapped from Salesforce multipicklists). Suburb context. Sticky quick-facts sidebar. Similar homes row.

## Beat 5 — Service page (1 min)

`/services/supported-independent-living`. Funding tabs (NDIS / TAC / WorkSafe). Standards & Safeguards accordion (open the "SIL pricing changes — 1 July 2026" item).

## Beat 6 — Easy Read toggle (1 min)

Click "Easy Read" in toolbar. Page redraws — 20-22px body, max 50ch line length, muted brand. Same Payload locale infrastructure as VI/ZH; different content discipline.

## Beat 7 — Multilingual switch (45s)

EN → VI → ZH via toolbar. `<html lang>` switches; nav, footer, and content body all swap. Marketing edits translations in /admin per-locale.

## Beat 8 — Accessibility toolbar (90s)

Text size A−/A+ scales body. Contrast high. Dyslexia font (OpenDyslexic from CDN). Reduce motion. All settings persist via localStorage. Briefly mention `npm run test:a11y` passes 21 tests across chromium + firefox + webkit.

## Beat 9 — Lead enquiry → Salesforce (90s)

Open the enquiry form. Step 1: "I am a client or family member." Step 2: SIL + Werribee. Step 3: name + email. Submit.

**Open Salesforce in a second window. Refresh the Leads list. The new Lead appears.**

"That's a real Salesforce Lead just created. The integration user has Create permission on Lead and Case; client/career enquiries become Leads, referrer enquiries become Cases. On failure the website still shows the user confirmation — we log the error for ops follow-up rather than break the form."

## Beat 10 — Agentforce chat (1 min)

Click the chat button. Ask "Tell me about SIL." If Cam has provided the Embedded Service Deployment IDs (set in SiteSettings), the real Agentforce widget responds. Otherwise the polished mock with canned answers handles it — 5 scripted patterns cover the most likely demo questions.

## Beat 11 — Site search (45s)

`/search`. Type "SIL". Real results from Pagefind index (Services, Case Studies, News are statically generated for indexing). Click into one.

(Note: if Payload collections are empty at demo time, the index will be sparse. Worth seeding 2-3 case studies + a few news items before demo day so this beat has bite.)

## Beat 12 — MCP / AI content (90s)

Open Claude Desktop side-by-side. Say:

> "Create a news article: 'CareChoice opens new home in Footscray' — slug `new-home-footscray-2026`, excerpt 'A new SDA home in Footscray opens its doors this month.'"

Claude calls the `payload_create_news` tool via `/api/mcp`. The draft appears in `/admin` → News. Switch to a browser tab on `/en/news`. After ISR revalidation, the article appears.

**If live MCP demo fails for any reason, play the pre-recorded Loom video (see `docs/mcp-claude-desktop-config.md`).**

---

## Closing (90s)

"Five weeks in. All 12 demo beats functional. Salesforce-write live, real Lead creation. Accessibility ≥94 on every polished page across chromium, firefox, and webkit. Pagefind index, OSM map, NDIS-flow content, marketing-curated photos."

"Final week: stubbed-page polish, demo-day script lock, two rehearsals, recorded-video fallback as ultimate failsafe."

"Question for the room: is this the direction we go with when we hit the formal RFP?"

---

## Pacing

| Time | Beat |
|---|---|
| 1:30 | End opening |
| 3:00 | End Beat 1+2 |
| 5:00 | End Beat 3 (SDA + map) |
| 7:00 | End Beat 4 (SDA detail) |
| 8:00 | End Beat 5 (Service) |
| 9:00 | End Beat 6 (Easy Read) |
| 9:45 | End Beat 7 (locale) |
| 11:15 | End Beat 8 (a11y toolbar) |
| 12:45 | End Beat 9 (enquiry → SF) |
| 13:45 | End Beat 10 (Agentforce) |
| 14:30 | End Beat 11 (search) |
| 16:00 | End Beat 12 (MCP) |
| 17:30 | Closing complete |

If long: drop Beat 11 (search) and Beat 12's full Claude Desktop demo (use the Loom). If short: linger on Beat 4 (SDA detail with photos) or Beat 12.

---

## Pre-flight checklist (10 minutes before demo)

- [ ] Production URL responds: `curl -I https://care-choice-website-demo.vercel.app/` returns 200/308
- [ ] Salesforce UAT is reachable (curl OAuth)
- [ ] `/api/sda-vacancies` returns `source: salesforce` with non-zero records
- [ ] Test enquiry submission: see new Lead in UAT
- [ ] Toolbar settings: open in incognito to verify clean first-load
- [ ] Loom video URL accessible (if MCP live demo plan B kicks in)
- [ ] Backup laptop charged
- [ ] Hotspot ready

---

## Notes from this rehearsal

(Fill in after the run.)

- Beat that felt strongest:
- Beat that felt weakest:
- One thing to fix before demo day:
- One thing to drop or shorten:
- Empty content surfaces? (search, case studies index, etc.)
- Real Agentforce vs mock at this point?
- MCP live or recording?

# Demo Walkthrough — Rehearsal #2

**Target duration:** 15-18 minutes (closer to the final 20-22 min demo)
**Audience:** Eric + stand-in audience member
**Pages covered:** All 8 polished templates + accessibility toolbar + Easy Read + locale switch
**Base URL:** https://care-choice-website-demo.vercel.app

---

## Opening (90s)

Frame: working demonstration, not production. Real infrastructure. Live Salesforce data.
Real content. Built in 4 weeks so far (out of 6). Today we walk through what's ready —
all 8 polished pages, the accessibility toolbar, Easy Read on SIL, Vietnamese and Mandarin
translations on SIL, accessibility green across the board.

Open `https://care-choice-website-demo.vercel.app/en/`.

---

## Beat 1 — Homepage (90s)

Pause on the hero. "Editorial typography. Magenta blocks. Every headline ends with a full stop.
This is the brand we signed off in 2024."

Scroll to audience pathways (3 cards). "Three doors above the fold."

Scroll to SDA preview row. "Live from Salesforce. 18 homes in UAT, 14 of them with map
coordinates we geocoded ourselves on the way through."

Quickly scroll past services, case-study spotlight, stats, news, footer. "All CMS-editable
except the Acknowledgement of Country, which is a global field."

---

## Beat 2 — SDA Listings with map (2 min)

Click "Find a home" in the nav.

Open Salesforce in a second window, navigate to the Sites list filtered to active SDA records.
"18 records there. 18 cards here."

Filter by region "CareChoice Homes". Show cards narrowing.

Toggle to **Map view**. "Open Street Map tiles. Markers placed by geocoding the addresses
through Nominatim — that's the OSM-affiliated free geocoder. We're not paying for a
Google Maps API key for this."

Click a marker, show the popup with "View this home" link. Click it.

---

## Beat 3 — SDA Home detail (2 min)

Pause on the hero. "Photography intake is the content team's task — for now we render the
placeholder treatment inside the bordered hero module."

Scroll to **accessibility & amenities grid**. "Mapped from the Salesforce amenity multipicklist
to Lucide icons. Whatever the team selects in Lumary surfaces here."

Scroll to **suburb context**. "Hand-written for the suburbs we have homes in."

Point at sticky sidebar. "Quick facts on the right. Enquiry CTA. SharePoint link for photos
and floorplans when the content team adds them."

Scroll to similar homes. "Region- and design-matched."

Go back to homepage.

---

## Beat 4 — Service page polished (1 min)

Click "Our services" in the nav. Click "Supported Independent Living".

Pause on the headline. "This is one of the eight polished templates."

Scroll to **funding tabs**. Click NDIS / TAC / WorkSafe. "Static content per tab for now."

Scroll past "How to get started" (5-step process) to "Standards & safeguards" accordion.
Open "SIL pricing changes — 1 July 2026". "This is the kind of compliance content that's
traditionally hard to update. With Payload, marketing edits it directly."

---

## Beat 5 — Easy Read toggle (90s)

**Click "Easy Read"** in the utility row.

The page redraws. Body 20-22px Regular. Line length capped at 50 characters. Magenta turned
down to tags only. Headings still end with a full stop.

"This is not a translation. It's a different version of the same content — same Payload locale
infrastructure, different content discipline. We have Easy Read content on SIL today, on
find-a-home page chrome, and 'coming soon' notices on the other pages we listed for demo."

Click Easy Read again to switch back.

---

## Beat 6 — Multilingual switch (45s)

Click **VI** in the utility row. The whole page swaps to Vietnamese — nav, footer, content body.

Click **ZH**. Same again, in Mandarin. `<html lang="zh-Hans">` for proper rendering.

"Translations live in Payload. Marketing edits them in `/admin` under each locale dropdown.
No deploy needed."

Click EN.

---

## Beat 7 — Accessibility toolbar (90s)

Show **A+** text size. The whole site bumps to 20px body. Hit A− back to default.

Switch contrast to **high**. Magenta-60 disappears, borders thicken to 9px, text is full-black
PMS-675.

Toggle **Dyslexia font** on. OpenDyslexic loads from the CDN, the page redraws in that face.
Toggle back off.

Toggle **Reduce motion** on. Hover a card — no transform animation. Toggle off.

"Settings persist across page navigation via localStorage. Run Lighthouse live to show a11y
≥95 on any polished page."

---

## Beat 8 — Case Studies index + detail (90s)

Click "Stories" or visit `/case-studies`. Hero card + alternating grid.

Click into a story. Long-form layout — 720px reading column, summary lede, RichText body
rendered from Payload's Lexical, pull-quote with magenta accent, outcome metrics in 3 stat
tiles, CTA at the bottom.

---

## Beat 9 — Lead enquiry flow (90s)

Click "Make an enquiry" in the nav.

**Step 1** — choose "I am a client or family member". Continue.
**Step 2** — pick "Supported Independent Living", type "Werribee" for preference. Continue.
**Step 3** — name, email, optional phone, message. Send enquiry.

Confirmation page shows the magenta CTA module: "Your enquiry is with us. We'll be in touch
within one business day."

"The Salesforce write goes live in Week 5. Today the form validates with Zod and logs the
payload to Vercel logs — that's enough to demo the UX."

---

## Beat 10 — Search (45s)

Click "Search" in the nav (or visit `/search`). Type "SIL".

Note: in Plan 4 the static-render coverage is limited, so Pagefind's index is sparse. If
results are thin, switch to "this is the search UI infrastructure — Plan 5 either turns on
full static generation or swaps in Algolia to populate the index."

---

## Beat 11 — Axe + Lighthouse (90s)

In a terminal: `npm run test:a11y`. 7 routes pass (with documented A11Y-ADAPT suppressions
on color-contrast for white-on-magenta CTAs and small magenta text — both intentional per
the brand-vs-WCAG trade-offs we signed off).

Optionally show a live Lighthouse run in DevTools on the SIL page — a11y ≥95.

---

## Closing (90s)

"Four weeks in. All 8 polished pages live. Easy Read + VI + ZH on the SIL page. Accessibility
toolbar wired across the site. a11y green."

"Next two weeks: Salesforce enquiry write (Plan 5), Agentforce embed (Plan 5), MCP demo
(Plan 5), performance pass and final demo rehearsals (Plan 6). Demo day in week 6."

"Questions about the direction? Anything you'd want to see different by demo day?"

---

## Pacing

| Time | Beat |
|---|---|
| 1:30 | End opening |
| 3:00 | End Beat 1 |
| 5:00 | End Beat 2 |
| 7:00 | End Beat 3 |
| 8:00 | End Beat 4 |
| 9:30 | End Beat 5 (Easy Read) |
| 10:15 | End Beat 6 (locale) |
| 11:45 | End Beat 7 (toolbar) |
| 13:15 | End Beat 8 (case studies) |
| 14:45 | End Beat 9 (enquiry) |
| 15:30 | End Beat 10 (search) |
| 17:00 | End Beat 11 (a11y + Lighthouse) |
| 18:30 | Closing complete |

If long: skip Beat 10 (search) and shorten Beat 11. If short: linger on Beat 5 (Easy Read)
or run Lighthouse on more than one page.

---

## Things to watch for

- Easy Read theme rendering correctly on `/easy-read/services/supported-independent-living`
- VI / ZH content showing in nav + page body (not just URL change)
- Accessibility settings persisting across page navigation
- Lighthouse score live ≥95 on every polished page
- Console errors in DevTools — should be quiet
- Magenta colour consistency between the design system tokens and what renders

---

## Notes from this rehearsal

(Fill in after the run.)

- Beat that felt strongest:
- Beat that felt weakest:
- One thing to fix before demo day:
- One thing to drop or shorten:

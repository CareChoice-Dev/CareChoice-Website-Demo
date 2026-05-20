# Demo Walkthrough — Rehearsal #1

**Target duration:** 8-10 minutes (a quarter of the full 20-22 min final demo)
**Audience:** Eric + stand-in audience member (test the flow)
**Pages covered:** 4 polished templates from Plan 3
**Base URL:** https://care-choice-website-demo.vercel.app

---

## Opening (60s)

"This is the working demonstration for the CareChoice website redesign. It's a 6-week build, we're 3 weeks in, and four of the eight polished templates are ready. We're using the time today to walk through those four — homepage, find-a-home index, a home detail page, and the SIL service page — to see if the direction holds up before we go into the second half of the build."

Open `https://care-choice-website-demo.vercel.app/en/`.

---

## Beat 1 — Homepage (2 min)

**Pause on the hero.** "Editorial typography. Magenta blocks. Every headline ends with a full stop — that's a brand voice rule. No emoji, no decorative arrows."

Scroll to **audience pathways** (3 cards).

"Three doors above the fold. The current site has eleven items in its top nav — this resolves the 'too many entry points' problem."

Scroll to **SDA preview row**.

"These four cards are live from Salesforce. If a marketing person publishes a new home in Lumary, it shows up here inside ten minutes — no developer involved."

Scroll past **services**, **case study spotlight**, **stats row**, **news row**, to **footer**.

"Magenta band, white contact strip, Acknowledgement of Country, ABN. Everything down here is CMS-editable except the acknowledgement, which is a global field."

---

## Beat 2 — Find a Home index (2 min)

Click **"Find a home"** in the nav (or the homepage SDA preview "See all homes" link).

Open Salesforce in a second window, navigate to the Sites list filtered to active SDA records, lay it side-by-side.

"What you're seeing on the left is 18 records pulled from this exact list on the right. Live."

**Filter** by region (e.g. "CareChoice Homes") — show cards narrowing.

**Toggle to Map view.** "Open Street Map tiles, free. Markers placed by geocoding the addresses through Nominatim. We're not paying for a Google Maps key for this."

Switch back to **Grid**, click on a card with available vacancies (e.g. `28 Eaton Road, Mount Duneed`).

---

## Beat 3 — SDA Home detail (2 min)

**Pause on the hero.** "Photography intake is the content team's task in Week 3-4 — for now we render this placeholder treatment inside the bordered hero module."

Scroll to **accessibility & amenities grid.** "Mapped from the Salesforce amenity multipicklist to Lucide icons. Whatever the team selects in Lumary surfaces here."

Scroll to **suburb context.** "Hand-written context for the suburbs we have homes in — Mount Duneed, Mickleham, Werribee, and so on. Small touch that says 'we know this place.'"

Point at **sticky sidebar.** "Quick facts on the right, sticky as you scroll. Enquiry CTA. SharePoint link for photos and floorplans when the content team adds them."

Scroll to **similar homes.** "Region- and design-matched. Pure JavaScript on the data we already loaded."

Go back.

---

## Beat 4 — SIL Service page (2 min)

Click **"Our services"** in the nav. Click **"Supported Independent Living"**.

**Pause on the headline.** "This is one of the eight polished templates. The other services — Complex Care, Positive Behaviour Support — render under the generic service template for now and get this treatment in Week 4 or 5."

Scroll to **funding tabs.** Click between NDIS / TAC / WorkSafe. "Static for now; the content team can deepen these tabs in Week 5."

Scroll to **how to get started** — 5-step process. "This is the conversion-driver. Plain language, clear steps."

Scroll to **standards & safeguards accordion.** Open the "SIL pricing changes — 1 July 2026" item. "This is the kind of compliance-driven content that's traditionally hard to update. With Payload, marketing edits it directly."

Open the **FAQ accordion**. Close it.

Scroll to **magenta CTA.** "Every polished page ends with a clear ask."

---

## Closing (60s)

"That's four pages, three weeks. Next three weeks: the remaining four polished pages (case studies, enquiry flow, search, plus the homepage's Easy Read version), the accessibility toolbar, the Vietnamese and Mandarin translations, and the Agentforce chat embed. Two more rehearsals — one mid-Week 5, the final on demo day."

"Questions about the direction? Anything you'd want to see different by the time we're in front of the exec team?"

---

## Pacing cues

| Time | Cue |
|---|---|
| 0:00 | Open `/en/` |
| 1:00 | Scroll to SDA preview |
| 2:00 | Click "Find a home" |
| 4:00 | Click an SDA card |
| 6:00 | Click "Our services" → SIL |
| 8:00 | Magenta CTA at bottom of SIL |
| 9:00 | Closing |

If long: skip Beat 3's similar-homes scroll, or skip the FAQ accordion open in Beat 4. If short: linger on the homepage hero or the SDA grid/map toggle.

---

## Things to watch for in this rehearsal

- Page load feel — does anything feel slow? (Especially the find-a-home page on first hit, where the geocoder may run.)
- Magenta — is the colour right on every page?
- Headings — every one ends with a full stop?
- Empty states — what does the homepage look like if a collection is empty?
- Console errors — open DevTools, watch for red.

---

## Notes from this rehearsal

(Fill in after the run.)

- Beat that felt strongest:
- Beat that felt weakest:
- One thing to fix before Rehearsal #2:
- One thing to fix before final demo:

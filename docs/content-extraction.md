# Content extraction workflow

The `npm run extract` script scrapes a public URL on carechoice.com.au and creates a Payload record (Pages, Services, or News). It does NOT do AI brand-voice refinement — that's a manual step in `/admin` after scraping.

## Usage

```bash
# Dry run — print what would be created without writing
npm run extract -- https://carechoice.com.au/about --collection pages --dry-run

# Real write
npm run extract -- https://carechoice.com.au/services/sil --collection services
npm run extract -- https://carechoice.com.au/about --collection pages
npm run extract -- https://carechoice.com.au/news/some-article --collection news
```

## Brand-voice refinement (manual)

After scraping, open the record in `/admin` and refine:
- Headlines: sentence case, end with a full stop
- Body: "we" for CareChoice, "you" for the reader; never "the participant", always "a person"
- First mention of every acronym (NDIS, SIL, SDA, TAC, WorkSafe) paired with plain-English explanation
- No emoji, no decorative unicode

Use Claude or another LLM to draft the refined version; paste back into the editor and verify against the brand voice rules in `../docs/superpowers/specs/2026-05-19-carechoice-demo-design.md` §6.

## Scraping checklist (Week 2)

Pages to extract for the demo:
- `/about` → Pages
- `/our-team` → Pages
- `/ndis` → Pages
- `/who-we-support` → Pages
- `/services/supported-independent-living` → Services ✅ (extracted in Plan 3 Task 30; brand-voice refinement is a manual /admin task)
- `/services/short-term-accommodation` → Services
- `/services/community-access` → Services
- `/services/positive-behaviour-support` → Services
- `/complex-care` → Services
- Top 3 most recent news articles → News

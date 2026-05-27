# CareChoice Website — Compliance Checklist

Living record of the site's accessibility, NDIS, and privacy compliance posture.
Use this for audits, RFP responses, and as the re-test runbook.

**Last verified:** 2026-05-27 against production
(`https://care-choice-website-demo.vercel.app`).

> Demo context: this is the executive-buy-in demo build, not the production
> launch. Items marked *(manual)* are deliberately left for the content/admin
> team or the production build.

---

## Scorecard

| Standard | Status | Closed by | Evidence |
|---|---|---|---|
| WCAG 2.1 AA | ✅ | pre-existing | axe sweep (`tests/e2e/a11y.e2e.spec.ts`) |
| WCAG 2.2 AA — 2.4.11 Focus Not Obscured | ✅ | `6fbba03` (2026-05-27) | Header/footer are `relative`, Ask CC panel pushes content — no obscuring overlay. Keyboard audit doc. |
| WCAG 2.2 AA — 2.4.13 Focus Appearance | ✅ | `6fbba03` (2026-05-27) | Visible focus ring on all inputs/selects/dropdowns + global `:focus-visible` safety net (`styles.css`). axe sweep. |
| WCAG 2.2 AA — 2.5.7 Dragging Movements | ✅ | `6fbba03` (2026-05-27) | Leaflet map `zoomControl` + `keyboard` pan + grid alternative, region `aria-label` (`SDAMap.tsx`). |
| NDIS Practice Standards — accessible complaints | ✅ | `2cb0da2` (2026-05-27) | Online complaints form at `/complaints` with anonymous option + NDIS Commission escalation. *(submission handler is a placeholder — wire to Salesforce Case for production)* |
| NDIS provider registration number on site | ✅ (mechanism) | `de392e7` (2026-05-27) | Footer + Organization JSON-LD read `ndisProviderNumber` from SiteSettings. **(manual)** Populate the value in `/admin → Site Settings`. |
| Privacy statement on data-collecting forms | ✅ | `de392e7` + `6fbba03` | Inline note under enquiry submit; consent + Privacy link on newsletter and complaints forms. |
| Cookie / consent banner | ✅ | `2cb0da2` (2026-05-27) | First-visit non-modal banner, Accept/Reject, choice persisted, "Manage cookies" re-open (`CookieConsent.tsx`, `ManageCookiesButton.tsx`). No tracking cookies set pre-consent. |
| Schema.org structured data (local SEO) | ✅ | `6fbba03` + `2cb0da2` | Organization (site-wide), Service + FAQPage (service pages), Accommodation (SDA homes). Validated by `tests/e2e/structured-data.e2e.spec.ts`. |

---

## Evidence map (SC → where it's covered)

| Area | File(s) |
|---|---|
| Automated axe sweep (11 routes) | `tests/e2e/a11y.e2e.spec.ts` |
| Structured-data validation | `tests/e2e/structured-data.e2e.spec.ts` |
| Manual keyboard audit | `docs/wcag-keyboard-audit.md` |
| Focus ring (global) | `src/app/(frontend)/styles.css` (`:focus-visible` base rule) |
| Map no-drag alternative | `src/components/sda/SDAMap.tsx` |
| Complaints | `src/app/(frontend)/[locale]/complaints/page.tsx`, `src/components/forms/ComplaintForm.tsx`, `src/app/api/complaint/route.ts` |
| Cookie consent | `src/components/chrome/CookieConsent.tsx`, `src/components/chrome/ManageCookiesButton.tsx` |
| NDIS number + ABN | `src/globals/SiteSettings.ts`, `src/components/chrome/Footer.tsx` |
| Org / Service / Home schema | `src/components/seo/OrganizationJsonLd.tsx`, `ServiceJsonLd.tsx`, `SDAHomeJsonLd.tsx` |

---

## Re-test runbook

Both suites run against the live deploy with no local server (sidesteps the
Payload schema-push prompt that hangs `next dev`). Chromium only by default.

```bash
# Accessibility sweep (WCAG 2.1 / 2.2 AA, 11 routes)
npm run test:a11y:prod

# Structured-data (schema.org JSON-LD) validation
npm run test:schema:prod
```

Override the target or sample home if needed:

```bash
A11Y_BASE_URL=https://<deploy>.vercel.app A11Y_SDA_HOME_ID=<sf-id> npm run test:a11y:prod
```

To run locally instead, start `npm run dev` first (answer the schema-push
prompt), then `npm run test:a11y` (uses `localhost:3000`, all 3 browsers).

**Last run (2026-05-27, prod):** a11y 11/11 passed · schema 3/3 passed.

Manual confirmation for the Google rich-results parser:
- https://search.google.com/test/rich-results — paste a service URL + an SDA home URL.

---

## Carried-forward suppression

`color-contrast` is suppressed in the axe sweep — every blocking instance is a
documented A11Y-ADAPT brand decision (PMS-675 small text, 16px+ semibold
white-on-magenta, FAB border). Full rationale in
`docs/wcag-keyboard-audit.md` → "A11Y-ADAPT suppressions". Any *new*
contrast issue must be fixed or narrowly excluded with a comment — never a
blanket suppression.

---

## Residual items (deliberately deferred)

| Item | Owner | Notes |
|---|---|---|
| Populate NDIS provider number + ABN | Admin team | `/admin → Site Settings` |
| Wire complaint submissions to Salesforce Case | Dev (production) | `/api/complaint` currently logs + returns success |
| Easy Read version of `/complaints` | Content team | en-easy-read locale via `/admin` |
| Confirm no third-party tracking cookies | Dev (pre-launch) | Banner is in place; today the site sets none, so consent is precautionary |
| Manual keyboard pass on new surfaces | QA | Checklist items marked **(confirm)** in the keyboard audit doc |

# VI / ZH Translation Workflow

CareChoice content gets translated into Vietnamese (`vi`) and Mandarin Simplified (`zh`) via Payload's locale dropdown in /admin. For the demo, we translate four targets:

1. SIL service (Services collection)
2. Navigation global (top nav + footer columns + AoC)
3. SDA Homes Page global (chrome — same content as Easy Read variant)
4. Audience Pathways collection (3 cards)

For translations beyond the demo set, content team uses a translation agency (Plan 5 scope).

## Drafting with Claude

For each piece of content:

1. Open Claude (claude.ai or the API)
2. Use this prompt template:

```
Please translate the following CareChoice content from Australian English into Vietnamese.

Rules:
- Match the voice: warm, plain, direct. Not corporate.
- Keep proper nouns (NDIS, TAC, WorkSafe, SDA, SIL) in English. They are formal terms that participants will encounter in their plans.
- Match formatting: if the source uses a bulleted list, the target uses a bulleted list. If headings end with a full stop, target headings should too.
- For Vietnamese: use Northern Vietnamese formal register (consistent with what NDIS-funded providers use in Australia).

Source content:
[paste the EN content]
```

For Mandarin, swap the language and rule:

```
Please translate the following CareChoice content from Australian English into Mandarin (Simplified Chinese).

Rules:
- Match the voice: warm, plain, direct. Not corporate.
- Keep proper nouns (NDIS, TAC, WorkSafe, SDA, SIL) in English.
- Headings end with the Mandarin full stop "。"
- Use simplified characters throughout.

Source content:
[paste the EN content]
```

3. Have a bilingual reviewer (e.g. Cam or a colleague) skim the output for tone and any obvious errors before committing it to /admin.

## Entering translations in /admin

1. Open `/admin`
2. Navigate to the collection/global (e.g. Services → Supported Independent Living)
3. Top of edit page → locale dropdown → switch to "Vietnamese" or "Mandarin (Simplified)"
4. Paste the translated content into the localised fields:
   - `title`, `intro`, `content`, `summary`, etc. — all localised fields appear empty in the new locale
5. Save

## Demo translation set checklist

### Vietnamese
- [ ] Services / Supported Independent Living: title, intro, content
- [ ] Navigation: topNav labels, footerColumns headings + link labels, acknowledgementOfCountry
- [ ] SDA Homes Page: title, intro, filterLabels, emptyStateMessage
- [ ] AudiencePathways (3 records): label, description

### Mandarin (Simplified)
- [ ] Same set as Vietnamese

## Verification

Visit the production URL with the locale prefix swapped:
- `https://care-choice-website-demo.vercel.app/vi/services/supported-independent-living`
- `https://care-choice-website-demo.vercel.app/zh/services/supported-independent-living`
- `https://care-choice-website-demo.vercel.app/vi/find-a-home`
- `https://care-choice-website-demo.vercel.app/zh/find-a-home`

Confirm: page chrome, nav, footer, all in target language. SDA cards remain English (Salesforce records aren't localised).

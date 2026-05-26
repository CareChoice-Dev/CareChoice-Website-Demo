/**
 * Seed three CareChoice news articles. Idempotent: skips if a doc with
 * the same slug exists. Publishes immediately.
 *
 * Usage:
 *   NODE_ENV=production PAYLOAD_DISABLE_AUTO_PUSH=true npm run seed:news
 *
 * The env flags skip Payload's interactive schema-push prompt that
 * triggers from the now-unused sizes_* columns in the media table.
 */

import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })
dotenv.config()

import { getPayload } from 'payload'

type Block = { type: 'h2'; text: string } | { type: 'p'; text: string }

type NewsTag = 'ndis' | 'housing' | 'community' | 'sector' | 'carechoice'

interface NewsSeed {
  slug: string
  title: string
  publishDate: string
  author: string
  excerpt: string
  tags: NewsTag[]
  relatedServiceSlugs?: string[]
  body: Block[]
}

const ARTICLES: NewsSeed[] = [
  {
    slug: 'carechoice-100th-resident',
    title: 'A hundred homes later: CareChoice welcomes its 100th SDA resident.',
    publishDate: '2026-04-10',
    author: 'CareChoice Communications',
    tags: ['carechoice', 'housing'],
    relatedServiceSlugs: ['supported-independent-living'],
    excerpt:
      'Eight years after the first CareChoice home opened its doors in Werribee, we welcomed our hundredth resident this week — and quietly redefined what "good housing" can look like in Specialist Disability Accommodation.',
    body: [
      { type: 'h2', text: 'A hundred is just a number. Until it isn\'t.' },
      {
        type: 'p',
        text: "When Sara moved into our newest CareChoice Home in Point Cook last Tuesday, she became our hundredth resident. There was no fanfare — Sara had asked for a quiet move-in, a long bath, and curry for dinner — but the team marked the milestone in their own way. A hundred residents means a hundred housing journeys, a hundred families with their evenings back, and a hundred sets of keys that mean something.",
      },
      { type: 'h2', text: 'What we\'ve learned in eight years.' },
      {
        type: 'p',
        text: 'Across the twenty-one CareChoice Homes operating today — from Werribee to Wyndham Vale, Bendigo to the Mornington Peninsula — three things have stayed true.',
      },
      {
        type: 'p',
        text: 'First: residents don\'t want institutional. They want home. Wide doorways and accessible bathrooms are non-negotiable, but so are an open kitchen where housemates can cook together, a back garden, and a front door you choose to open.',
      },
      {
        type: 'p',
        text: "Second: support that flexes outperforms support that's fixed. Our average resident's support hours have dropped 35% in their first eighteen months — not because needs reduced, but because independence built and the team learned when to step back.",
      },
      {
        type: 'p',
        text: "Third: the people matter more than the property. The same home with the wrong team is a worse outcome than a smaller home with the right one. We staff for fit first, roster second.",
      },
      { type: 'h2', text: 'What\'s next.' },
      {
        type: 'p',
        text: 'Three new CareChoice Homes are under construction this year, in Mickleham, Wyndham Vale, and a yet-to-be-announced site in regional Victoria. We expect to welcome our 130th resident before Christmas. By then, Sara tells us, she\'ll be hosting Friday-night pizza at her place.',
      },
    ],
  },
  {
    slug: 'wyndham-community-gardens',
    title: 'Hands in the dirt: a community-garden partnership with Wyndham Council.',
    publishDate: '2026-05-02',
    author: 'Annette Pham, CareChoice Community Lead',
    tags: ['community', 'housing'],
    relatedServiceSlugs: ['community-access', 'supported-independent-living'],
    excerpt:
      "Three CareChoice Homes in Wyndham have started shared garden plots — alongside their neighbours — at council community-garden sites. The first tomatoes are due in February. Bragging rights are already being staked.",
    body: [
      { type: 'h2', text: 'Why gardens.' },
      {
        type: 'p',
        text: "When the Wyndham City Council put out the call for community-garden partners earlier this year, we put our hand up — and brought three of our home managers into the conversation. Gardens are a quiet kind of medicine: physical activity at any pace, sensory regulation, the predictability of a weekly rhythm, the unforced sociability of running into your neighbour at the compost bin.",
      },
      {
        type: 'p',
        text: "For our residents, they also do something subtler. They put our homes into the community fabric, not adjacent to it. A community garden plot is a stake in the suburb.",
      },
      { type: 'h2', text: 'How it works.' },
      {
        type: 'p',
        text: 'Each of three CareChoice Homes — at Point Cook, Werribee, and Wyndham Vale — has been allocated two raised beds at their closest council garden. Residents who want in choose what gets planted (lots of strawberries, predictably; some heroically optimistic carrots). Support workers go along on planting and harvest days, on a regular Community Access schedule.',
      },
      {
        type: 'p',
        text: "The council provides the beds, the water, and the soil mix. The community garden coordinators provide the workshops. We provide the residents, the enthusiasm, and — based on the first month — a competitive streak that we did not see coming.",
      },
      { type: 'h2', text: 'What\'s growing in.' },
      {
        type: 'p',
        text: "First plantings went in over the long weekend: tomatoes, basil, snow peas, silverbeet, a strawberry patch each, and — at the insistence of three of our Werribee residents — a pumpkin patch with stretch goals. First harvest is expected late February. Friday-night dinners at the homes are already being planned around the produce.",
      },
      {
        type: 'p',
        text: "If your council runs a similar programme and you'd like to talk about how to involve a local SDA provider, we'd love to share notes.",
      },
    ],
  },
  {
    slug: 'ndis-2026-practice-standards',
    title: 'The 2026 NDIS practice-standard updates: what\'s actually changing.',
    publishDate: '2026-05-18',
    author: 'David Tran, CareChoice Quality & Compliance',
    tags: ['ndis', 'sector'],
    relatedServiceSlugs: ['home-nursing-disability-support', 'supported-independent-living'],
    excerpt:
      "The NDIS Quality and Safeguards Commission has confirmed the practice-standard changes that take effect from 1 July 2026. We've read the 187 pages so you don't have to. Here's the participant-facing summary.",
    body: [
      { type: 'h2', text: 'The short version.' },
      {
        type: 'p',
        text: 'On 1 July 2026, three of the NDIS practice standards that govern registered providers are being updated. The changes are largely good news for participants — they sharpen the language around choice and control, lift the bar on incident reporting, and require more explicit handover documentation between providers. There is no new admin burden for participants themselves.',
      },
      { type: 'h2', text: 'What\'s changing — and why it matters to you.' },
      {
        type: 'p',
        text: "Choice and control: providers will be required to document, not just claim, how participants are involved in decisions about their own supports. For CareChoice this is already business as usual — every support plan we build is signed off by the participant or their nominee — but the formal documentation requirement means a slightly tighter feedback loop. Expect to see one extra signature page in your annual support-plan review.",
      },
      {
        type: 'p',
        text: 'Incident reporting: the threshold for reportable incidents has been clarified. In practice this means more incidents get formally recorded — which is a good thing, because the data drives systemic improvements — but it does NOT mean more incidents are happening. We\'ve flagged this proactively to all our participants and their nominees so the reporting volume doesn\'t come as a surprise.',
      },
      {
        type: 'p',
        text: 'Handover documentation: when supports transfer between providers (for example, when someone moves from one SIL provider to another, or between an SDA provider and a community-access provider), a written handover summary is now required. Participants have the right to a copy. If you\'re changing providers, ask for it — and ask both sides to sit down together if the situation is complex.',
      },
      { type: 'h2', text: 'What CareChoice is doing.' },
      {
        type: 'p',
        text: "Our quality and compliance team has been preparing for these changes since the draft consultation closed in February. Updated support-plan templates roll out from 1 June 2026 — two weeks early, deliberately, so we can iron out the format before the changes go live. Our 1 July rollout is being coordinated with our independent quality auditor, the NDIS portal team, and the participant advisory group that meets quarterly at our Werribee office.",
      },
      { type: 'h2', text: 'What you should do.' },
      {
        type: 'p',
        text: 'Nothing urgent. When your next annual support-plan review comes around, you\'ll see the new template. If you have questions in the meantime, your local CareChoice team leader is the right first call — and our compliance team is happy to walk through the changes in detail with any participant or nominee who wants the longer version.',
      },
    ],
  },
]

function toLexical(blocks: Block[]): unknown {
  const children = blocks.map((b) => {
    const textNode = {
      type: 'text',
      text: b.text,
      format: 0,
      style: '',
      mode: 'normal',
      version: 1,
      detail: 0,
    }
    if (b.type === 'h2') {
      return {
        type: 'heading',
        tag: 'h2',
        format: '',
        indent: 0,
        version: 1,
        direction: 'ltr',
        children: [textNode],
      }
    }
    return {
      type: 'paragraph',
      format: '',
      indent: 0,
      version: 1,
      direction: 'ltr',
      textFormat: 0,
      textStyle: '',
      children: [textNode],
    }
  })
  return {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      direction: 'ltr',
      children,
    },
  }
}

async function main() {
  const { default: config } = await import('../payload.config')
  const payload = await getPayload({ config })

  // Look up service IDs once for the relatedServices links.
  const services = await payload.find({
    collection: 'services',
    limit: 50,
    pagination: false,
  })
  const slugToId = new Map<string, number | string>()
  for (const s of services.docs as Array<{ id: number | string; slug: string }>) {
    slugToId.set(s.slug, s.id)
  }

  let created = 0
  let skipped = 0

  for (const a of ARTICLES) {
    const existing = await payload.find({
      collection: 'news',
      where: { slug: { equals: a.slug } },
      limit: 1,
    })
    if (existing.docs.length > 0) {
      console.log(`Exists, skipping: ${a.slug}`)
      skipped++
      continue
    }

    const relatedServices = (a.relatedServiceSlugs ?? [])
      .map((slug) => slugToId.get(slug))
      .filter((id): id is number | string => id !== undefined)

    if (
      a.relatedServiceSlugs &&
      relatedServices.length !== a.relatedServiceSlugs.length
    ) {
      const missing = a.relatedServiceSlugs.filter((slug) => !slugToId.has(slug))
      console.warn(`  WARN ${a.slug}: missing service slug(s): ${missing.join(', ')}`)
    }

    await payload.create({
      collection: 'news',
      locale: 'en',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: {
        title: a.title,
        slug: a.slug,
        publishDate: a.publishDate,
        author: a.author,
        excerpt: a.excerpt,
        tags: a.tags,
        relatedServices,
        body: toLexical(a.body),
        _status: 'published',
      } as any,
    })

    console.log(`Created: ${a.slug}`)
    created++
  }

  console.log()
  console.log(`Done. Created: ${created}, skipped: ${skipped}.`)
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})

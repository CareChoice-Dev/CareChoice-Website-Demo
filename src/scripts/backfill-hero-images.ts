/**
 * Backfill heroImage on existing news + case-study docs that were seeded
 * without one. Maps each slug to a Media doc by id — based on the
 * three photos currently in the Media library.
 *
 * Usage:
 *   NODE_ENV=production PAYLOAD_DISABLE_AUTO_PUSH=true npm run backfill:hero-images
 *
 * Idempotent: only updates docs whose heroImage is null/undefined.
 * Re-run safely.
 */

import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })
dotenv.config()

import { getPayload } from 'payload'

interface Mapping {
  collection: 'news' | 'case-studies'
  slug: string
  mediaId: number
}

const MAPPINGS: Mapping[] = [
  // News — currently 3 without hero
  { collection: 'news', slug: 'carechoice-100th-resident',   mediaId: 4 }, // SDA Home Test wide banner
  { collection: 'news', slug: 'wyndham-community-gardens',   mediaId: 7 }, // Front (exterior + garden)
  { collection: 'news', slug: 'ndis-2026-practice-standards', mediaId: 6 }, // Indoor (neutral)
  // Case studies — currently 3 without hero
  { collection: 'case-studies', slug: 'priya-tac-recovery',        mediaId: 4 }, // wide banner
  { collection: 'case-studies', slug: 'marcus-finds-his-saturday', mediaId: 7 }, // Front (getting out)
  { collection: 'case-studies', slug: 'wendy-out-of-hospital',     mediaId: 6 }, // Indoor (settled home)
]

async function main() {
  const { default: config } = await import('../payload.config')
  const payload = await getPayload({ config })

  let updated = 0
  let skipped = 0
  const missing: string[] = []

  for (const m of MAPPINGS) {
    const result = await payload.find({
      collection: m.collection,
      where: { slug: { equals: m.slug } },
      limit: 1,
      depth: 0,
    })
    const doc = result.docs[0]
    if (!doc) {
      missing.push(`${m.collection}/${m.slug}`)
      continue
    }

    if (doc.heroImage) {
      console.log(`Already has hero, skipping: ${m.collection}/${m.slug}`)
      skipped++
      continue
    }

    await payload.update({
      collection: m.collection,
      id: doc.id,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: { heroImage: m.mediaId } as any,
    })

    console.log(`Updated: ${m.collection}/${m.slug} → media id ${m.mediaId}`)
    updated++
  }

  console.log()
  console.log(`Done. Updated: ${updated}, skipped: ${skipped}.`)
  if (missing.length > 0) {
    console.log(`Missing docs: ${missing.join(', ')}`)
  }
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})

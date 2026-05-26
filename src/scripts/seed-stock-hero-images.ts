/**
 * Download placeholder hero photos from Lorem Picsum and upload them
 * to the Media collection (which routes to Vercel Blob via the
 * storage-vercel-blob adapter). Then reassign each news + case-study
 * doc's `heroImage` to a unique one.
 *
 * Usage:
 *   NODE_ENV=production PAYLOAD_DISABLE_AUTO_PUSH=true npm run seed:stock-hero-images
 *
 * Idempotent: looks up Media by the auto-generated alt key
 * ("Demo hero: <slug>") and reuses if it already exists.
 *
 * Picsum photos are CC0 / free to use. Quality is good but uncurated,
 * so swap individual ones in admin if a particular doc deserves
 * something more specific.
 */

import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })
dotenv.config()

import { getPayload } from 'payload'

interface Target {
  collection: 'news' | 'case-studies'
  slug: string
  // Picsum seed — drives which photo gets fetched. Deterministic across runs.
  seed: string
  // Human-meaningful description, used as alt text.
  alt: string
}

const TARGETS: Target[] = [
  // News
  { collection: 'news', slug: 'sorrenberg-street-point-cook-opens', seed: 'cc-sorrenberg', alt: 'A new CareChoice home in Point Cook.' },
  { collection: 'news', slug: 'carechoice-100th-resident',          seed: 'cc-100th',      alt: 'Welcoming our 100th resident.' },
  { collection: 'news', slug: 'wyndham-community-gardens',          seed: 'cc-garden',     alt: 'Community garden at one of our SDA homes.' },
  { collection: 'news', slug: 'ndis-2026-practice-standards',       seed: 'cc-ndis-2026',  alt: 'New NDIS practice standards take effect.' },
  // Case studies
  { collection: 'case-studies', slug: 'daniel-first-year',        seed: 'cs-daniel', alt: "Daniel's first year of independent living." },
  { collection: 'case-studies', slug: 'priya-tac-recovery',       seed: 'cs-priya',  alt: 'Priya returns to teaching after recovery.' },
  { collection: 'case-studies', slug: 'marcus-finds-his-saturday', seed: 'cs-marcus', alt: "Marcus's Saturday routine — swimming, work, friends." },
  { collection: 'case-studies', slug: 'wendy-out-of-hospital',    seed: 'cs-wendy',  alt: 'Home support after a rapid hospital discharge.' },
]

const WIDTH = 1920
const HEIGHT = 1080

async function downloadPicsumPhoto(seed: string): Promise<Buffer> {
  const url = `https://picsum.photos/seed/${encodeURIComponent(seed)}/${WIDTH}/${HEIGHT}`
  const res = await fetch(url, { redirect: 'follow' })
  if (!res.ok) {
    throw new Error(`Picsum fetch failed for seed=${seed}: HTTP ${res.status}`)
  }
  const arrayBuf = await res.arrayBuffer()
  return Buffer.from(arrayBuf)
}

async function main() {
  const { default: config } = await import('../payload.config')
  const payload = await getPayload({ config })

  let createdMedia = 0
  let reusedMedia = 0
  let assignedHero = 0
  let skippedHero = 0

  for (const t of TARGETS) {
    const mediaAltKey = `Demo hero: ${t.slug}`

    // Reuse if we've already uploaded for this slug.
    const existing = await payload.find({
      collection: 'media',
      where: { alt: { equals: mediaAltKey } },
      limit: 1,
      depth: 0,
    })

    let mediaId: number | string
    if (existing.docs.length > 0) {
      mediaId = existing.docs[0].id
      console.log(`Reusing media for ${t.slug} (id ${mediaId})`)
      reusedMedia++
    } else {
      const buffer = await downloadPicsumPhoto(t.seed)
      const filename = `demo-${t.slug}.jpg`
      const created = await payload.create({
        collection: 'media',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data: { alt: mediaAltKey, caption: t.alt } as any,
        file: {
          data: buffer,
          mimetype: 'image/jpeg',
          name: filename,
          size: buffer.length,
        },
      })
      mediaId = created.id
      console.log(`Uploaded ${filename} → media id ${mediaId} (${buffer.length} bytes)`)
      createdMedia++
    }

    // Assign to the target doc.
    const targetDocs = await payload.find({
      collection: t.collection,
      where: { slug: { equals: t.slug } },
      limit: 1,
      depth: 0,
    })
    if (targetDocs.docs.length === 0) {
      console.warn(`  WARN ${t.collection}/${t.slug}: doc not found, skipping hero assignment`)
      continue
    }
    const doc = targetDocs.docs[0]
    const currentHero =
      typeof doc.heroImage === 'object' && doc.heroImage !== null
        ? (doc.heroImage as { id?: number | string }).id
        : doc.heroImage
    if (currentHero === mediaId) {
      console.log(`  heroImage already set: ${t.collection}/${t.slug}`)
      skippedHero++
      continue
    }
    await payload.update({
      collection: t.collection,
      id: doc.id,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: { heroImage: mediaId } as any,
    })
    console.log(`  Assigned hero: ${t.collection}/${t.slug} → media ${mediaId}`)
    assignedHero++
  }

  console.log()
  console.log(`Done. Media: created ${createdMedia}, reused ${reusedMedia}.`)
  console.log(`Hero: assigned ${assignedHero}, already-set skipped ${skippedHero}.`)
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})

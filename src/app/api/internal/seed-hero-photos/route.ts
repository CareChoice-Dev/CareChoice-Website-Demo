/**
 * ONE-SHOT seed endpoint — replaces the broken Media docs from the
 * earlier local-seed attempt with real photos uploaded through Payload
 * running in the Vercel runtime (which has the correct public-store
 * BLOB_READ_WRITE_TOKEN).
 *
 * Flow:
 *   1. Auth: must be a logged-in Payload admin
 *   2. Cleanup: delete every Media doc whose alt starts "Demo hero:"
 *      and null heroImage on any news/case-study doc that referenced them
 *   3. Upload: for each target, fetch a Picsum photo, payload.create()
 *      it as Media (so the storage adapter writes to Blob with the right
 *      runtime token), assign heroImage on the linked doc
 *
 * Hit GET /api/internal/seed-hero-photos while signed into /admin.
 * Once successful, this route can be deleted.
 */

import { getPayload } from 'payload'
import config from '@payload-config'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

interface Target {
  collection: 'news' | 'case-studies'
  slug: string
  seed: string
  caption: string
}

const TARGETS: Target[] = [
  { collection: 'news', slug: 'sorrenberg-street-point-cook-opens', seed: 'cc-sorrenberg', caption: 'A new CareChoice home in Point Cook.' },
  { collection: 'news', slug: 'carechoice-100th-resident',          seed: 'cc-100th',      caption: 'Welcoming our 100th resident.' },
  { collection: 'news', slug: 'wyndham-community-gardens',          seed: 'cc-garden',     caption: 'Community garden at one of our SDA homes.' },
  { collection: 'news', slug: 'ndis-2026-practice-standards',       seed: 'cc-ndis-2026',  caption: 'New NDIS practice standards take effect.' },
  { collection: 'case-studies', slug: 'daniel-first-year',         seed: 'cs-daniel', caption: "Daniel's first year of independent living." },
  { collection: 'case-studies', slug: 'priya-tac-recovery',        seed: 'cs-priya',  caption: 'Priya returns to teaching after recovery.' },
  { collection: 'case-studies', slug: 'marcus-finds-his-saturday', seed: 'cs-marcus', caption: "Marcus's Saturday — swimming, work, friends." },
  { collection: 'case-studies', slug: 'wendy-out-of-hospital',     seed: 'cs-wendy',  caption: 'Home support after a rapid hospital discharge.' },
]

const WIDTH = 1920
const HEIGHT = 1080

export async function GET(req: Request) {
  const payload = await getPayload({ config })

  // Auth — must be a logged-in admin user.
  const { user } = await payload.auth({ headers: req.headers })
  if (!user) {
    return Response.json(
      { error: 'auth required — sign in to /admin first' },
      { status: 403 },
    )
  }

  const summary = {
    cleanupNulled: 0,
    cleanupDeleted: 0,
    mediaCreated: 0,
    heroAssigned: 0,
    errors: [] as string[],
    created: [] as Array<{ slug: string; mediaId: number | string; url: string }>,
  }

  // 1. Cleanup — find existing demo Media (broken from prior run).
  const broken = await payload.find({
    collection: 'media',
    where: { alt: { like: 'Demo hero:' } },
    limit: 50,
    pagination: false,
    depth: 0,
  })
  const brokenIds = new Set(broken.docs.map((d) => d.id))

  for (const collection of ['news', 'case-studies'] as const) {
    const all = await payload.find({
      collection,
      limit: 100,
      pagination: false,
      depth: 0,
    })
    for (const doc of all.docs) {
      const heroId =
        typeof doc.heroImage === 'object' && doc.heroImage !== null
          ? (doc.heroImage as { id?: number | string }).id
          : doc.heroImage
      if (heroId !== null && heroId !== undefined && brokenIds.has(heroId as number)) {
        await payload.update({
          collection,
          id: doc.id,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          data: { heroImage: null } as any,
        })
        summary.cleanupNulled++
      }
    }
  }

  for (const d of broken.docs) {
    try {
      await payload.delete({ collection: 'media', id: d.id })
      summary.cleanupDeleted++
    } catch (err) {
      summary.errors.push(`delete media ${d.id}: ${(err as Error).message}`)
    }
  }

  // 2. Upload + assign — run concurrently to fit in the lambda time budget.
  await Promise.all(
    TARGETS.map(async (t) => {
      try {
        const picUrl = `https://picsum.photos/seed/${encodeURIComponent(t.seed)}/${WIDTH}/${HEIGHT}`
        const res = await fetch(picUrl, { redirect: 'follow', cache: 'no-store' })
        if (!res.ok) throw new Error(`picsum ${res.status}`)
        const buffer = Buffer.from(await res.arrayBuffer())

        const created = await payload.create({
          collection: 'media',
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          data: { alt: `Demo hero: ${t.slug}`, caption: t.caption } as any,
          file: {
            data: buffer,
            mimetype: 'image/jpeg',
            name: `demo-${t.slug}.jpg`,
            size: buffer.length,
          },
        })
        summary.mediaCreated++
        summary.created.push({
          slug: t.slug,
          mediaId: created.id,
          url: (created as { url?: string }).url ?? '',
        })

        const targetDocs = await payload.find({
          collection: t.collection,
          where: { slug: { equals: t.slug } },
          limit: 1,
          depth: 0,
        })
        if (targetDocs.docs.length === 0) {
          throw new Error(`doc not found: ${t.collection}/${t.slug}`)
        }
        await payload.update({
          collection: t.collection,
          id: targetDocs.docs[0].id,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          data: { heroImage: created.id } as any,
        })
        summary.heroAssigned++
      } catch (err) {
        summary.errors.push(`${t.collection}/${t.slug}: ${(err as Error).message}`)
      }
    }),
  )

  return Response.json(summary, { status: 200 })
}

/**
 * Delete any smoke-test content lingering in production Payload.
 *
 * Targets `case-studies` and `news` collections where the title or slug
 * starts with "smoke test" / "smoke-test" (case-insensitive). Lists matches
 * before deleting so the operator can spot anything unintended.
 *
 * Usage: npm run delete-smoke-test
 *
 * Reads DATABASE_URL etc. from .env.local — same pattern as the seed
 * scripts. Idempotent: re-running it after a clean DB is a no-op.
 */

import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })
dotenv.config()

import { getPayload } from 'payload'

const COLLECTIONS_TO_SCAN = ['case-studies', 'news'] as const
type TargetCollection = (typeof COLLECTIONS_TO_SCAN)[number]

const SMOKE_REGEX = /^smoke[\s-]?test/i

async function main() {
  const { default: config } = await import('../payload.config')
  const payload = await getPayload({ config })

  let totalDeleted = 0

  for (const collection of COLLECTIONS_TO_SCAN) {
    const result = await payload.find({
      collection: collection as TargetCollection,
      limit: 200,
      depth: 0,
    })

    const matches = result.docs.filter((doc) => {
      const d = doc as unknown as Record<string, unknown>
      const title = typeof d.title === 'string' ? d.title : ''
      const slug = typeof d.slug === 'string' ? d.slug : ''
      return SMOKE_REGEX.test(title) || SMOKE_REGEX.test(slug)
    })

    if (matches.length === 0) {
      console.log(`[${collection}] clean — no smoke-test docs.`)
      continue
    }

    console.log(`[${collection}] found ${matches.length} smoke-test doc(s):`)
    for (const doc of matches) {
      const d = doc as unknown as Record<string, unknown>
      console.log(`  - id=${String(d.id)} title="${String(d.title)}"`)
    }

    for (const doc of matches) {
      const d = doc as unknown as Record<string, unknown>
      const id = d.id
      if (typeof id !== 'string' && typeof id !== 'number') continue
      await payload.delete({ collection: collection as TargetCollection, id })
      totalDeleted += 1
      console.log(`  ✗ deleted id=${String(id)}`)
    }
  }

  console.log(`\nDone. Deleted ${totalDeleted} doc(s) total.`)
  process.exit(0)
}

main().catch((err) => {
  console.error('delete-smoke-test failed:', err)
  process.exit(1)
})

/**
 * Seed AudiencePathways collection with the 3 demo records.
 *
 * Usage: npm run seed-audience-pathways
 *
 * Idempotent: if records with the same target URL already exist, the script
 * skips them. Safe to re-run.
 */

import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })
dotenv.config()

import { getPayload } from 'payload'

const PATHWAYS = [
  {
    label: 'I am a client or family',
    description: 'Find the support that suits you and the people you love.',
    targetUrl: '/who-we-support',
    icon: 'users',
    sortOrder: 1,
  },
  {
    label: 'I am a professional referrer',
    description: 'Resources, intake, and the team that handles referrals.',
    targetUrl: '/referrer-hub',
    icon: 'briefcase',
    sortOrder: 2,
  },
  {
    label: 'I want to work at CareChoice',
    description: 'Hands-on roles, clinical roles, and the support behind them.',
    targetUrl: '/careers',
    icon: 'heart-handshake',
    sortOrder: 3,
  },
]

async function main() {
  const { default: config } = await import('../payload.config')
  const payload = await getPayload({ config })

  for (const p of PATHWAYS) {
    const existing = await payload.find({
      collection: 'audience-pathways',
      where: { targetUrl: { equals: p.targetUrl } },
      limit: 1,
    })
    if (existing.docs.length > 0) {
      console.log(`Exists, skipping: ${p.label}`)
      continue
    }
    await payload.create({
      collection: 'audience-pathways',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: p as any,
      locale: 'en',
    })
    console.log(`Created: ${p.label}`)
  }

  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})

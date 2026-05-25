/**
 * Push the current Payload schema to the database without starting the dev server.
 *
 * Use this when a Payload collection/global gains new fields and you need them in
 * the DB before deploying to production (Vercel's production build doesn't auto-
 * push; only local `npm run dev` does). Triggers Payload init → drizzle push,
 * then exits cleanly.
 *
 * Usage: npm run push-schema
 *
 * The script pipes 'y' so drizzle's "accept warnings?" prompt won't hang. If
 * destructive column drops are involved you'll see them logged before the push
 * runs — abort with Ctrl+C if anything looks wrong.
 */

import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })
dotenv.config()

import { getPayload } from 'payload'

async function main() {
  const { default: config } = await import('../payload.config')
  // getPayload triggers init which calls the postgres adapter's connect →
  // drizzle push when push !== false. The push is interactive; we pipe 'y' via
  // the shell wrapper in package.json so it accepts the warnings prompt.
  await getPayload({ config })
  console.log('\nSchema pushed. Exiting.')
  process.exit(0)
}

main().catch((err) => {
  console.error('push-schema failed:', err)
  process.exit(1)
})

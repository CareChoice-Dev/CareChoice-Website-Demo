/**
 * Content extraction CLI.
 *
 * Usage:
 *   npm run extract -- <source-url> --collection <slug> [--dry-run]
 *
 * Examples:
 *   npm run extract -- https://carechoice.com.au/about --collection pages --dry-run
 *   npm run extract -- https://carechoice.com.au/services/sil --collection services
 *
 * Scrapes the URL, extracts <h1>, <h2>, <p> into a stub record, and writes it
 * into Payload via the Local API. AI brand-voice refinement is a manual step
 * in /admin afterwards.
 */

import { load } from 'cheerio'
import dotenv from 'dotenv'

// Load .env.local explicitly (dotenv/config only reads .env)
dotenv.config({ path: '.env.local' })
dotenv.config() // fallback to .env if .env.local missing

interface CLIArgs {
  url: string
  collection: 'pages' | 'services' | 'news'
  dryRun: boolean
}

function parseArgs(argv: string[]): CLIArgs {
  const url = argv[2]
  if (!url) {
    throw new Error('Missing <source-url> argument.')
  }
  const collectionIdx = argv.indexOf('--collection')
  if (collectionIdx === -1 || !argv[collectionIdx + 1]) {
    throw new Error('Missing --collection flag.')
  }
  const collection = argv[collectionIdx + 1]
  if (!['pages', 'services', 'news'].includes(collection)) {
    throw new Error(`Unsupported collection: ${collection}`)
  }
  return {
    url,
    collection: collection as CLIArgs['collection'],
    dryRun: argv.includes('--dry-run'),
  }
}

function deriveSlug(url: string): string {
  const u = new URL(url)
  const segments = u.pathname.split('/').filter(Boolean)
  return (segments[segments.length - 1] || 'home').toLowerCase().replace(/[^a-z0-9-]/g, '-')
}

async function scrape(url: string) {
  const res = await fetch(url, { headers: { 'User-Agent': 'CareChoice-Demo-Content-Extractor' } })
  if (!res.ok) {
    throw new Error(`Failed to fetch ${url}: ${res.status}`)
  }
  const html = await res.text()
  const $ = load(html)

  const title = $('h1').first().text().trim() || $('title').text().trim() || 'Untitled'
  const intro = $('p').first().text().trim()
  const paragraphs = $('p')
    .map((_, el) => $(el).text().trim())
    .get()
    .filter((p) => p.length > 40)
    .slice(0, 20)

  return {
    title,
    intro,
    body: paragraphs.join('\n\n'),
  }
}

async function main() {
  const args = parseArgs(process.argv)
  console.log(`Scraping ${args.url}...`)
  const scraped = await scrape(args.url)

  const slug = deriveSlug(args.url)
  console.log(`Derived slug: ${slug}`)
  console.log(`Title: ${scraped.title}`)
  console.log(`Intro: ${scraped.intro.slice(0, 100)}...`)
  console.log(`Body paragraphs captured: ${scraped.body.split('\n\n').length}`)

  if (args.dryRun) {
    console.log('[dry-run] Skipping Payload write.')
    return
  }

  const { default: config } = await import('../payload.config')
  const { getPayload } = await import('payload')
  const payload = await getPayload({ config })

  const data: Record<string, unknown> = {
    title: scraped.title,
    slug,
    intro: `[source: ${args.url}]\n\n${scraped.intro}`,
  }

  if (args.collection === 'news') {
    data.publishDate = new Date().toISOString()
    data.excerpt = scraped.intro.slice(0, 200)
  }

  if (args.collection === 'services') {
    // Services collection requires a category. Default to 'housing' for
    // accommodation-related services; user can adjust in /admin.
    data.category = 'housing'
  }

  await payload.create({
    collection: args.collection,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: data as any,
    locale: 'en',
  })

  console.log(`Created ${args.collection} entry "${slug}".`)
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})

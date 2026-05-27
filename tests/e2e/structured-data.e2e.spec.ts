import { test, expect } from '@playwright/test'

/**
 * Structured-data (schema.org JSON-LD) validation.
 *
 * Confirms every `<script type="application/ld+json">` block on the key
 * templates is valid JSON and carries the schema.org fields that Google's
 * Rich Results parser requires. This guards against a malformed block
 * silently breaking rich results / local SEO.
 *
 * Shares A11Y_BASE_URL with the a11y sweep so it can run against a live
 * deploy (default localhost). Run: npm run test:schema:prod
 */

const BASE_URL = (process.env.A11Y_BASE_URL ?? 'http://localhost:3000').replace(/\/$/, '')
const SAMPLE_SDA_HOME = process.env.A11Y_SDA_HOME_ID ?? 'a1R5g000000Lp4VEAS'

/** Extract + JSON.parse every ld+json block on the page. Fails on invalid JSON. */
async function readJsonLd(route: string, page: import('@playwright/test').Page) {
  await page.goto(`${BASE_URL}${route}`, { waitUntil: 'domcontentloaded' })
  const blocks = await page.locator('script[type="application/ld+json"]').allTextContents()
  return blocks.map((raw, i) => {
    try {
      return JSON.parse(raw) as Record<string, unknown>
    } catch (e) {
      throw new Error(`Invalid JSON-LD block #${i} on ${route}: ${(e as Error).message}`)
    }
  })
}

function byType(blocks: Record<string, unknown>[], type: string) {
  return blocks.find((b) => b['@type'] === type)
}

test('home page emits a valid Organization block', async ({ page }) => {
  const blocks = await readJsonLd('/en/', page)
  const org = byType(blocks, 'Organization')
  expect(org, 'Organization JSON-LD present').toBeTruthy()
  expect(org!['@context']).toBe('https://schema.org')
  expect(typeof org!.name).toBe('string')
  expect(org!.contactPoint, 'Organization has a contactPoint').toBeTruthy()
})

test('service page emits valid Service + FAQPage blocks', async ({ page }) => {
  const blocks = await readJsonLd('/en/services/respite', page)

  const service = byType(blocks, 'Service')
  expect(service, 'Service JSON-LD present').toBeTruthy()
  expect(typeof service!.name).toBe('string')
  expect(service!.provider, 'Service has a provider').toBeTruthy()

  const faq = byType(blocks, 'FAQPage')
  expect(faq, 'FAQPage JSON-LD present').toBeTruthy()
  expect(Array.isArray(faq!.mainEntity), 'FAQPage.mainEntity is an array').toBe(true)
  expect((faq!.mainEntity as unknown[]).length, 'FAQPage has at least one question').toBeGreaterThan(0)
})

test('SDA home detail emits a valid Accommodation block', async ({ page }) => {
  const blocks = await readJsonLd(`/en/find-a-home/${SAMPLE_SDA_HOME}`, page)
  const home = byType(blocks, 'Accommodation')
  expect(home, 'Accommodation JSON-LD present').toBeTruthy()
  expect(typeof home!.name).toBe('string')
  expect(home!.provider, 'Accommodation has a provider').toBeTruthy()
  // A local-SEO result needs a location signal — address and/or geo. Both are
  // emitted conditionally per record, so require at least one.
  expect(
    Boolean(home!.address) || Boolean(home!.geo),
    'Accommodation has address and/or geo',
  ).toBe(true)
})

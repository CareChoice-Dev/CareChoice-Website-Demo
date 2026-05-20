import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

const ROUTES = [
  '/en/',
  '/en/find-a-home',
  '/en/services/supported-independent-living',
  '/en/case-studies',
  '/en/enquiry',
  '/en/search',
  '/en/dev/components',
]

for (const route of ROUTES) {
  test(`a11y: ${route} has no critical or serious violations`, async ({ page }) => {
    await page.goto(`http://localhost:3000${route}`, { waitUntil: 'networkidle' })

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag22aa'])
      .analyze()

    const blocking = results.violations.filter(
      (v) => v.impact === 'critical' || v.impact === 'serious',
    )

    if (blocking.length > 0) {
      console.log('\n--- axe violations for', route, '---')
      for (const v of blocking) {
        console.log(`[${v.impact}] ${v.id}: ${v.help}`)
        console.log(`  ${v.helpUrl}`)
        for (const n of v.nodes.slice(0, 3)) {
          console.log(`    target: ${n.target.join(', ')}`)
          console.log(`    html:   ${n.html.slice(0, 200)}`)
        }
      }
    }

    expect(blocking, `${blocking.length} blocking a11y violations on ${route}`).toEqual([])
  })
}

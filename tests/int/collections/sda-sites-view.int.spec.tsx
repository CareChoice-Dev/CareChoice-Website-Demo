import { describe, it, expect } from 'vitest'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { SDAPhotos } from '@/collections/SDAPhotos'

/**
 * Smoke test for the custom SDA Sites list view.
 *
 * We deliberately do NOT import `SDASitesView` at runtime here. Doing so
 * transitively loads `@payloadcms/next/templates` → `@payloadcms/ui`,
 * which imports `.css` files that Vitest's ESM loader can't handle without
 * extra plumbing. The view itself is a React Server Component exercised by
 * the Payload admin runtime; this spec just guards the wiring.
 *
 * What we check:
 *   1. The SDAPhotos collection config registers the custom view via
 *      `admin.components.views.list.Component` with the canonical path
 *      that Payload's importMap generator resolves.
 *   2. The referenced source file actually exists on disk.
 */
describe('SDASitesView (custom Payload list view)', () => {
  it('is registered on the SDAPhotos collection as the list view', () => {
    const listView = SDAPhotos.admin?.components?.views?.list
    const component =
      typeof listView === 'object' && listView !== null && 'Component' in listView
        ? listView.Component
        : listView
    expect(component).toBe('src/collections/SDASitesView#SDASitesView')
  })

  it('the registered view file exists on disk', () => {
    // Vitest runs from the project root.
    const filePath = path.resolve(
      process.cwd(),
      'src/collections/SDASitesView.tsx',
    )
    expect(existsSync(filePath)).toBe(true)
  })
})

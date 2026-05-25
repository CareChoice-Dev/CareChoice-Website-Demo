'use client'

import { A11ySettings } from './A11ySettings'
import { EasyReadToggle } from './EasyReadToggle'
import { LocaleSwitcher } from './LocaleSwitcher'
import type { UrlLocaleSlug } from '@/lib/locale'

export function AccessibilityToolbar({ currentLocale }: { currentLocale: UrlLocaleSlug }) {
  return (
    <div className="flex flex-wrap items-center gap-2 justify-end" aria-label="Accessibility and language">
      <A11ySettings />
      <EasyReadToggle />
      <LocaleSwitcher current={currentLocale} />
    </div>
  )
}

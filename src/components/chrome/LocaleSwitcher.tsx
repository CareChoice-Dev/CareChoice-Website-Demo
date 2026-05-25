'use client'

import { usePathname, useRouter } from 'next/navigation'
import { URL_LOCALE_SLUGS, type UrlLocaleSlug } from '@/lib/locale'

const LABELS: Record<UrlLocaleSlug, string> = {
  en: 'EN',
  vi: 'VI',
  zh: 'ZH',
  'easy-read': 'Easy Read',
}

export function LocaleSwitcher({ current }: { current: UrlLocaleSlug }) {
  const router = useRouter()
  const pathname = usePathname()

  const switchTo = (slug: UrlLocaleSlug) => {
    const segments = pathname.split('/').filter(Boolean)
    segments[0] = slug
    const next = '/' + segments.join('/')
    router.push(next)
  }

  return (
    <div role="group" aria-label="Language" className="flex gap-0 items-center">
      {URL_LOCALE_SLUGS.map((slug) => {
        const active = slug === current
        return (
          <button
            key={slug}
            type="button"
            aria-pressed={active}
            onClick={() => switchTo(slug)}
            className={`h-[28px] px-2.5 text-[11px] font-semibold uppercase tracking-wider border-2 border-black -ml-[2px] first:ml-0 ${
              active ? 'bg-cc-magenta text-white' : 'bg-white text-black hover:bg-cc-surface-pink'
            }`}
          >
            {LABELS[slug]}
          </button>
        )
      })}
    </div>
  )
}

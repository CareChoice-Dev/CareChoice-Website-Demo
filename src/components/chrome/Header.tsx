import Image from 'next/image'
import { getPayload } from 'payload'
import config from '@payload-config'
import { Button } from '@/components/primitives/Button'
import { Link } from '@/components/primitives/Link'
import { AccessibilityToolbar } from './AccessibilityToolbar'
import type { PayloadLocale } from '@/lib/locale'
import { payloadLocaleToUrlSlug } from '@/lib/locale'

interface NavItem {
  label: string
  url: string
  highlightAsCta?: boolean
}

export async function Header({ locale }: { locale: PayloadLocale }) {
  const payload = await getPayload({ config })
  const nav = await payload.findGlobal({
    slug: 'navigation',
    locale,
    fallbackLocale: 'en',
  })

  const topNav: NavItem[] = Array.isArray(nav?.topNav) ? (nav.topNav as NavItem[]) : []
  const ctas = topNav.filter((i) => i.highlightAsCta)
  const links = topNav.filter((i) => !i.highlightAsCta)

  const currentSlug = payloadLocaleToUrlSlug(locale)

  return (
    <header className="border-b-2 border-cc-black bg-cc-white">
      <div className="max-w-[1280px] mx-auto px-6 md:px-8 py-4 flex flex-col gap-3">
        <div className="flex items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-2 no-underline" aria-label="CareChoice home">
            <Image src="/brand/logo-magenta.svg" alt="" width={120} height={32} className="h-8 w-auto" priority />
            <span className="sr-only">CareChoice</span>
          </Link>

          <nav aria-label="Primary" className="hidden md:flex items-center gap-6">
            {links.map((item) => (
              <Link key={item.url} href={item.url} className="font-semibold no-underline hover:underline">
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {ctas.map((cta) => (
              <Button key={cta.url} href={cta.url} size="md">
                {cta.label} ▸
              </Button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-end">
          <AccessibilityToolbar currentLocale={currentSlug} />
        </div>
      </div>
    </header>
  )
}

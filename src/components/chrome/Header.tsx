import Image from 'next/image'
import { getPayload } from 'payload'
import config from '@payload-config'
import { Button } from '@/components/primitives/Button'
import { Link } from '@/components/primitives/Link'
import { AccessibilityToolbar } from './AccessibilityToolbar'
import { ServicesDropdown } from './ServicesDropdown'
import { MobileNav } from './MobileNav'
import { AskCCTrigger } from '@/components/ask/AskCCTrigger'
import type { PayloadLocale } from '@/lib/locale'
import { payloadLocaleToUrlSlug } from '@/lib/locale'

interface NavChild {
  label: string
  url: string
  description?: string
}

interface NavItem {
  label: string
  url: string
  highlightAsCta?: boolean
  children?: NavChild[]
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
  const hrefPrefix = `/${currentSlug}`

  return (
    <header className="relative border-b-2 border-cc-black bg-cc-white">
      <div className="max-w-[1280px] mx-auto px-6 md:px-8 py-4 flex flex-col gap-3">
        <div className="flex items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-2 no-underline" aria-label="CareChoice home">
            <Image src="/brand/logo-magenta.svg" alt="" width={120} height={32} className="h-8 w-auto" priority />
            <span className="sr-only">CareChoice</span>
          </Link>

          <nav aria-label="Primary" className="hidden md:flex items-center gap-6">
            {links.map((item) => {
              const hasChildren = Array.isArray(item.children) && item.children.length > 0
              if (hasChildren) {
                return (
                  <ServicesDropdown
                    key={`${item.url}-${item.label}`}
                    label={item.label}
                    parentUrl={item.url}
                    hrefPrefix={hrefPrefix}
                    items={item.children!}
                  />
                )
              }
              return (
                <Link key={item.url} href={item.url} className="font-semibold no-underline hover:underline">
                  {item.label}
                </Link>
              )
            })}
          </nav>

          <div className="flex items-center gap-3">
            {ctas.map((cta) => (
              <Button key={cta.url} href={cta.url} size="md" className="hidden md:inline-flex">
                {cta.label} ▸
              </Button>
            ))}
            <MobileNav items={topNav} hrefPrefix={hrefPrefix} />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          <AskCCTrigger variant="header-icon" />
          <AccessibilityToolbar currentLocale={currentSlug} />
        </div>
      </div>
    </header>
  )
}

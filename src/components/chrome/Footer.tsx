import { getPayload } from 'payload'
import config from '@payload-config'
import { Link } from '@/components/primitives/Link'
import { ContactStrip } from './ContactStrip'
import { NewsletterSignup } from './NewsletterSignup'
import { TrustMarks } from './TrustMarks'
import { InclusionFlags } from './InclusionFlags'
import type { PayloadLocale } from '@/lib/locale'

interface FooterColumn {
  heading: string
  links?: Array<{ label: string; url: string }>
}

export async function Footer({ locale }: { locale: PayloadLocale }) {
  const payload = await getPayload({ config })
  const nav = await payload.findGlobal({
    slug: 'navigation',
    locale,
    fallbackLocale: 'en',
  })

  const columns: FooterColumn[] = Array.isArray(nav?.footerColumns)
    ? (nav.footerColumns as FooterColumn[])
    : []
  const aoc = (nav?.acknowledgementOfCountry as string) ?? ''

  return (
    <footer className="bg-cc-magenta text-cc-black border-t-[7px] border-cc-black mt-16">
      <div className="max-w-[1280px] mx-auto px-6 md:px-8 py-10 flex flex-col gap-8">
        <ContactStrip />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {columns.map((col) => (
            <div key={col.heading}>
              <h3 className="eyebrow mb-3">{col.heading}</h3>
              <ul className="flex flex-col gap-2">
                {(col.links ?? []).map((l) => (
                  <li key={l.url}>
                    <Link href={l.url} className="font-semibold no-underline hover:underline">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {aoc && (
          <div className="border-t-2 border-cc-black pt-4 text-sm max-w-3xl">
            {aoc}
          </div>
        )}

        <NewsletterSignup />

        <TrustMarks />

        <InclusionFlags />

        <div className="flex flex-wrap gap-4 text-xs border-t-2 border-cc-black pt-4">
          <Link href="/privacy">Privacy.</Link>
          <Link href="/accessibility">Accessibility statement.</Link>
          <span>ABN — TBA</span>
          <span>© CareChoice {new Date().getFullYear()}.</span>
        </div>
      </div>
    </footer>
  )
}

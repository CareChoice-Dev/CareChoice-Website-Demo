import { notFound } from 'next/navigation'
import { isUrlSlug, urlSlugToLocale } from '@/lib/locale'
import { listServices } from '@/lib/payload-client'
import { ServiceCard } from '@/components/blocks/ServiceCard'
import { HeadlineBlock } from '@/components/blocks/HeadlineBlock'
import { CTABlock } from '@/components/blocks/CTABlock'

// Order services so the grid feels intentional rather than alphabetical-by-DB.
const PREFERRED_ORDER = [
  'supported-independent-living',
  'rapid-hospital-discharge',
  'home-nursing-disability-support',
  'community-access',
  'respite',
  'custodial-community-re-entry',
  'tac-worksafe-support',
  'positive-behaviour-support',
  'complex-care',
]

export default async function ServicesIndex({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale: urlLocale } = await params
  if (!isUrlSlug(urlLocale)) notFound()
  const locale = urlSlugToLocale(urlLocale)
  const services = await listServices(locale)

  const sorted = [...services].sort((a, b) => {
    const ai = PREFERRED_ORDER.indexOf(a.slug as string)
    const bi = PREFERRED_ORDER.indexOf(b.slug as string)
    if (ai === -1 && bi === -1) return 0
    if (ai === -1) return 1
    if (bi === -1) return -1
    return ai - bi
  })

  return (
    <div className="max-w-[1280px] mx-auto px-6 md:px-8 py-10 flex flex-col gap-8">
      <HeadlineBlock eyebrow="Our services" headline="Support that meets you where you are.">
        <p>
          From rapid hospital discharge through to long-term supported living, our services are built
          around the person — not the funding stream. Pick a service to see who it suits, what it
          includes, and how to get started.
        </p>
      </HeadlineBlock>

      {sorted.length === 0 ? (
        <p className="text-lg">Services will appear here once content is published in the admin.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sorted.map((s) => (
            <ServiceCard
              key={String(s.id)}
              title={s.title as string}
              href={`/services/${s.slug as string}`}
              category={s.category as string}
              intro={s.intro as string}
              fundingTypes={(s.fundingTypes as string[]) ?? []}
            />
          ))}
        </div>
      )}

      <CTABlock
        eyebrow="Not sure where to start?"
        title="Talk to us."
        body="A short phone call or a quick enquiry form — we'll help you find the right service and the right team."
        primary={{ label: 'Make an enquiry.', href: '/enquiry' }}
        secondary={{ label: 'Find a home.', href: '/find-a-home' }}
      />
    </div>
  )
}

import { notFound } from 'next/navigation'
import { isUrlSlug, urlSlugToLocale } from '@/lib/locale'
import { Hero } from '@/components/blocks/Hero'
import { AudiencePathways } from '@/components/blocks/AudiencePathways'
import { Section } from '@/components/primitives/Section'
import { SDAPreviewRow } from '@/components/blocks/SDAPreviewRow'
import { ServiceCardGrid } from '@/components/blocks/ServiceCardGrid'
import { CaseStudySpotlight } from '@/components/blocks/CaseStudySpotlight'
import { StatsRow } from '@/components/blocks/StatsRow'
import { NewsCardRow } from '@/components/blocks/NewsCardRow'
import { Link } from '@/components/primitives/Link'

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale: urlLocale } = await params
  if (!isUrlSlug(urlLocale)) notFound()
  const locale = urlSlugToLocale(urlLocale)
  const hrefPrefix = `/${urlLocale}`

  return (
    <div className="flex flex-col gap-0">
      <div className="max-w-[1280px] mx-auto px-6 md:px-8 pt-10 pb-0 w-full">
        <Hero
          title="Live the life you choose."
          lead="We'll be there. For thirty years CareChoice has supported people with disability across Australia — in their homes, in our homes, and out in their communities."
          ctas={[
            { label: 'Find a home.', href: '/find-a-home' },
            { label: 'Our services.', href: '/services' },
          ]}
        />
      </div>

      <div className="max-w-[1280px] mx-auto px-6 md:px-8 py-10 w-full">
        <AudiencePathways locale={locale} />
      </div>

      <div className="max-w-[1280px] mx-auto px-6 md:px-8 w-full">
        <Section
          number={1}
          title="Available now in our homes."
          rightSlot={
            <Link href="/find-a-home" className="font-semibold underline">
              See all homes →
            </Link>
          }
        >
          <SDAPreviewRow hrefPrefix={hrefPrefix} />
        </Section>
      </div>

      <div className="max-w-[1280px] mx-auto px-6 md:px-8 w-full">
        <Section
          number={2}
          title="Our services."
          rightSlot={
            <Link href="/services" className="font-semibold underline">
              All services →
            </Link>
          }
        >
          <ServiceCardGrid locale={locale} limit={6} />
        </Section>
      </div>

      <div className="max-w-[1280px] mx-auto px-6 md:px-8 w-full">
        <Section
          number={3}
          title="Stories from our community."
          rightSlot={
            <Link href="/case-studies" className="font-semibold underline">
              More stories →
            </Link>
          }
        >
          <CaseStudySpotlight locale={locale} hrefPrefix={hrefPrefix} />
        </Section>
      </div>

      <div className="max-w-[1280px] mx-auto px-6 md:px-8 w-full">
        <Section number={4} title="Why CareChoice.">
          <StatsRow />
        </Section>
      </div>

      <div className="max-w-[1280px] mx-auto px-6 md:px-8 w-full">
        <Section
          number={5}
          title="In the news."
          rightSlot={
            <Link href="/news" className="font-semibold underline">
              All news →
            </Link>
          }
        >
          <NewsCardRow locale={locale} limit={3} />
        </Section>
      </div>
    </div>
  )
}

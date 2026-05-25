import { notFound } from 'next/navigation'
import { isUrlSlug, urlSlugToLocale } from '@/lib/locale'
import { AudiencePathways } from '@/components/blocks/AudiencePathways'
import { Section } from '@/components/primitives/Section'
import { SDAPreviewRow } from '@/components/blocks/SDAPreviewRow'
import { ServiceCardGrid } from '@/components/blocks/ServiceCardGrid'
import { CaseStudySpotlight } from '@/components/blocks/CaseStudySpotlight'
import { StatsRow } from '@/components/blocks/StatsRow'
import { NewsCardRow } from '@/components/blocks/NewsCardRow'
import { Link } from '@/components/primitives/Link'
import { AskCCTrigger } from '@/components/ask/AskCCTrigger'

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
      <div className="max-w-[1280px] mx-auto px-6 md:px-8 pt-10 pb-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center">
          <div className="flex flex-col gap-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[0.95] tracking-tight">
              Find the right home, support, and team. With confidence.
            </h1>
            <p className="text-lg leading-relaxed max-w-prose">
              For thirty years CareChoice has supported people with disability across Australia —
              in their homes, in our homes, and out in their communities. Ask us anything.
            </p>
            <p className="flex items-start gap-2 text-sm border-l-4 border-cc-magenta bg-cc-surface-pink/60 px-3 py-2 max-w-prose">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="w-4 h-4 mt-0.5 shrink-0 text-cc-magenta"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v8M8 12h8" />
              </svg>
              <span>
                <span className="font-semibold">Make this site work for you.</span> Change text
                size, contrast, dyslexia-friendly font, motion, or switch to{' '}
                <Link href="/easy-read" className="underline font-semibold">
                  Easy Read
                </Link>{' '}
                — controls in the bar above.
              </span>
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <p className="eyebrow text-cc-magenta">Ask CareChoice.</p>
            <AskCCTrigger variant="hero" />
          </div>
        </div>
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

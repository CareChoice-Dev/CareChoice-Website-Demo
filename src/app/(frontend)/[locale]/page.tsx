import { notFound } from 'next/navigation'
import { isUrlSlug, urlSlugToLocale } from '@/lib/locale'
import { AudiencePathways } from '@/components/blocks/AudiencePathways'
import { Section } from '@/components/primitives/Section'
import { SDAPreviewRow } from '@/components/blocks/SDAPreviewRow'
import { ServiceCardGrid } from '@/components/blocks/ServiceCardGrid'
import { CaseStudySpotlight } from '@/components/blocks/CaseStudySpotlight'
import { AnimatedStatsRow } from '@/components/blocks/AnimatedStatsRow'
import { StepByStepBlock } from '@/components/blocks/StepByStepBlock'
import { NewsCardRow } from '@/components/blocks/NewsCardRow'
import { Link } from '@/components/primitives/Link'
import { Reveal } from '@/components/primitives/Reveal'
import { AskCCTrigger } from '@/components/ask/AskCCTrigger'

const HOW_IT_WORKS = [
  {
    title: 'Start a conversation.',
    body: "Tell us about the person, their goals, and the support they need — online, by phone, or in person. No commitment, no pressure.",
  },
  {
    title: 'We match home, support, and team.',
    body: 'We look at available SDA homes, the right support model, and a consistent team — not a rotating cast — and walk you through the options.',
  },
  {
    title: 'Move in with support around you.',
    body: "We plan the move together and stay alongside you afterwards, adjusting support as life changes.",
  },
]

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
      <div className="bg-cc-surface-pink">
        <div className="max-w-[1280px] mx-auto px-6 md:px-8 pt-10 pb-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-start">
            <div className="flex flex-col gap-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[0.95] tracking-tight">
                Find the right home, support, and team. With confidence.
              </h1>
              <p className="text-lg leading-relaxed max-w-prose">
                For thirty years CareChoice has supported people with disability across Australia —
                in their homes, in our homes, and out in their communities. Ask us anything.
              </p>
              <p className="flex items-start gap-2 text-sm border-l-4 border-cc-magenta bg-cc-white px-3 py-2 max-w-prose">
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
      </div>

      <div className="max-w-[1280px] mx-auto px-6 md:px-8 py-10 w-full">
        <AudiencePathways locale={locale} />
      </div>

      <div className="max-w-[1280px] mx-auto px-6 md:px-8 w-full">
        <Reveal>
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
        </Reveal>
      </div>

      <div className="max-w-[1280px] mx-auto px-6 md:px-8 w-full">
        <Reveal>
          <Section number={2} title="How CareChoice works.">
            <StepByStepBlock steps={HOW_IT_WORKS} />
          </Section>
        </Reveal>
      </div>

      <div className="max-w-[1280px] mx-auto px-6 md:px-8 w-full">
        <Reveal>
          <Section
            number={3}
            title="Our services."
            rightSlot={
              <Link href="/services" className="font-semibold underline">
                All services →
              </Link>
            }
          >
            <ServiceCardGrid locale={locale} limit={6} />
          </Section>
        </Reveal>
      </div>

      <div className="max-w-[1280px] mx-auto px-6 md:px-8 w-full">
        <Reveal>
          <Section
            number={4}
            title="Stories from our community."
            rightSlot={
              <Link href="/case-studies" className="font-semibold underline">
                More stories →
              </Link>
            }
          >
            <CaseStudySpotlight locale={locale} hrefPrefix={hrefPrefix} />
          </Section>
        </Reveal>
      </div>

      <div className="max-w-[1280px] mx-auto px-6 md:px-8 w-full">
        <Reveal>
          <Section number={5} title="Why CareChoice.">
            <AnimatedStatsRow />
          </Section>
        </Reveal>
      </div>

      <div className="max-w-[1280px] mx-auto px-6 md:px-8 w-full">
        <Reveal>
          <Section
            number={6}
            title="In the news."
            rightSlot={
              <Link href="/news" className="font-semibold underline">
                All news →
              </Link>
            }
          >
            <NewsCardRow locale={locale} limit={3} />
          </Section>
        </Reveal>
      </div>
    </div>
  )
}

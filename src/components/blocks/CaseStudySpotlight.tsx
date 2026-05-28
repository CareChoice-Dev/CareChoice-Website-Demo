import Image from 'next/image'
import NextLink from 'next/link'
import { Module } from '@/components/primitives/Module'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { PayloadLocale } from '@/lib/locale'

interface PopulatedMedia {
  url?: string | null
  alt?: string | null
}

interface OutcomeMetric {
  label?: string
  value?: string
}

interface CaseStudyDoc {
  id: number | string
  title: string
  slug: string
  participantName?: string
  summary?: string
  quote?: string
  heroImage?: PopulatedMedia | number | string | null
  outcomeMetrics?: OutcomeMetric[]
}

export async function CaseStudySpotlight({
  locale,
  hrefPrefix,
}: {
  locale: PayloadLocale
  hrefPrefix: string
}) {
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'case-studies',
    locale,
    fallbackLocale: 'en',
    limit: 1,
    sort: '-updatedAt',
  })
  const story = result.docs[0] as unknown as CaseStudyDoc | undefined
  if (!story) return null

  const hero =
    story.heroImage && typeof story.heroImage === 'object'
      ? (story.heroImage as PopulatedMedia)
      : null

  // Salesforce-style bold metric callout. Pick the first outcome metric with
  // both a value and label; falls back to nothing if none recorded.
  const metric = (story.outcomeMetrics ?? []).find(
    (m): m is { value: string; label: string } =>
      typeof m?.value === 'string' && m.value.length > 0 && typeof m?.label === 'string' && m.label.length > 0,
  )

  return (
    <NextLink
      href={`${hrefPrefix}/case-studies/${story.slug}`}
      className="block no-underline group"
    >
      <Module
        weight="default"
        className="grid grid-cols-1 md:grid-cols-2 gap-0 overflow-hidden transition-transform duration-[0.18s] ease-out group-hover:-translate-x-[2px] group-hover:-translate-y-[2px] group-hover:shadow-hard-card motion-reduce:transition-none"
      >
        <div className="relative aspect-[4/3] md:aspect-auto bg-cc-surface-pink flex items-center justify-center border-r-[7px] border-cc-black overflow-hidden">
          {hero?.url ? (
            <Image
              src={hero.url}
              alt={hero.alt ?? story.title}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          ) : (
            <span className="eyebrow text-cc-fg-muted">Photo TBA</span>
          )}
        </div>
        <div className="p-8 md:p-12 flex flex-col gap-4 bg-cc-white">
          <span className="eyebrow text-cc-magenta">
            Featured story{story.participantName ? ` · ${story.participantName}.` : '.'}
          </span>
          {metric && (
            <div className="flex flex-col gap-1 border-l-4 border-cc-magenta pl-4 -mt-1">
              <span className="text-5xl md:text-6xl font-bold leading-none tracking-tight text-cc-black">
                {metric.value}
              </span>
              <span className="font-semibold text-base text-cc-black/80">
                {metric.label}
              </span>
            </div>
          )}
          <h3 className="text-2xl md:text-3xl font-bold leading-tight tracking-tight">
            {story.title}
          </h3>
          {story.quote && (
            <p className="text-lg italic leading-relaxed text-cc-fg-muted">
              {story.quote}
            </p>
          )}
          {story.summary && !story.quote && (
            <p className="text-base leading-relaxed">{story.summary}</p>
          )}
          <span className="mt-auto pt-2 font-semibold underline">Read the full story ▸</span>
        </div>
      </Module>
    </NextLink>
  )
}

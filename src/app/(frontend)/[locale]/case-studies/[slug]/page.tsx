import { notFound } from 'next/navigation'
import { isUrlSlug, urlSlugToLocale } from '@/lib/locale'
import { findOneCaseStudyBySlug, getPayloadClient } from '@/lib/payload-client'
import { CaseStudyHero } from '@/components/blocks/CaseStudyHero'
import { CaseStudyPullQuote } from '@/components/blocks/CaseStudyPullQuote'
import { OutcomeMetricsRow } from '@/components/blocks/OutcomeMetricsRow'
import { CTABlock } from '@/components/blocks/CTABlock'
import { RichText } from '@/components/primitives/RichText'

interface OutcomeMetricField {
  label: string
  value: string
}

export async function generateStaticParams() {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'case-studies',
    limit: 50,
    locale: 'en',
  })
  return result.docs
    .filter((d): d is typeof d & { slug: string } => typeof d.slug === 'string')
    .flatMap((d) => [
      { locale: 'en', slug: d.slug },
      { locale: 'vi', slug: d.slug },
      { locale: 'zh', slug: d.slug },
      { locale: 'easy-read', slug: d.slug },
    ])
}

export default async function CaseStudyDetail({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale: urlLocale, slug } = await params
  if (!isUrlSlug(urlLocale)) notFound()
  const locale = urlSlugToLocale(urlLocale)
  const hrefPrefix = `/${urlLocale}`

  const story = await findOneCaseStudyBySlug(slug, locale)
  if (!story) notFound()

  const metrics = Array.isArray(story.outcomeMetrics)
    ? (story.outcomeMetrics as OutcomeMetricField[])
    : []

  return (
    <article className="flex flex-col gap-0">
      <div className="max-w-[1280px] mx-auto px-6 md:px-8 pt-6 w-full">
        <nav aria-label="Breadcrumb" className="text-sm">
          <a href={`${hrefPrefix}/`}>Home</a> · <a href={`${hrefPrefix}/case-studies`}>Stories</a> · {story.title as string}
        </nav>
      </div>

      <div className="max-w-[1280px] mx-auto px-6 md:px-8 pt-6 pb-0 w-full">
        <CaseStudyHero
          title={story.title as string}
          participantName={(story.participantName as string) ?? undefined}
        />
      </div>

      <div className="max-w-[800px] mx-auto px-6 md:px-8 py-10 w-full">
        {story.summary && (
          <p className="text-xl leading-relaxed mb-6">{story.summary as string}</p>
        )}
        <RichText value={story.story} />
        {(story.quote as string | undefined) && (
          <CaseStudyPullQuote
            quote={story.quote as string}
            attribution={story.participantName as string}
          />
        )}
      </div>

      {metrics.length > 0 && (
        <div className="max-w-[1280px] mx-auto px-6 md:px-8 py-6 w-full">
          <OutcomeMetricsRow metrics={metrics} />
        </div>
      )}

      <div className="max-w-[1280px] mx-auto px-6 md:px-8 py-10 w-full">
        <CTABlock
          eyebrow="More stories"
          title="Read more stories like this one."
          body="Or talk to us about what good support could look like for you."
          primary={{ label: 'More stories.', href: '/case-studies' }}
          secondary={{ label: 'Make an enquiry.', href: '/enquiry' }}
        />
      </div>
    </article>
  )
}

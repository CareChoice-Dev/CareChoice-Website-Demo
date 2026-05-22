import { notFound } from 'next/navigation'
import { isUrlSlug, urlSlugToLocale } from '@/lib/locale'
import { findOneServiceBySlug, getPayloadClient } from '@/lib/payload-client'
import { ServiceHero } from '@/components/primitives/ServiceHero'
import { Section } from '@/components/primitives/Section'
import { KeyPointsBlock } from '@/components/blocks/KeyPointsBlock'
import { AccordionBlock } from '@/components/blocks/AccordionBlock'
import { CTABlock } from '@/components/blocks/CTABlock'
import { RichText } from '@/components/primitives/RichText'
import { EasyReadNotice } from '@/components/primitives/EasyReadNotice'

interface BulletPoint {
  point: string
}

interface FaqEntry {
  question: string
  answer: string
}

export async function generateStaticParams() {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'services',
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

export default async function ServiceDetail({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale: urlLocale, slug } = await params
  if (!isUrlSlug(urlLocale)) notFound()
  const locale = urlSlugToLocale(urlLocale)
  const hrefPrefix = `/${urlLocale}`

  const service = await findOneServiceBySlug(slug, locale)
  if (!service) notFound()

  const isEasyRead = urlLocale === 'easy-read'
  let hasEasyReadContent = !isEasyRead
  if (isEasyRead) {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'services',
      where: { slug: { equals: slug } },
      locale: 'en-easy-read',
      fallbackLocale: null,
      limit: 1,
    })
    hasEasyReadContent = result.docs[0]?.title != null
  }

  const categoryLabels: Record<string, string> = {
    'disability-services': 'Disability Services',
    'complex-care': 'Complex Care',
    'specialist-services': 'Specialist Services',
    housing: 'Housing',
  }
  const category = (service.category as string) ?? ''
  const eyebrow = categoryLabels[category] ?? category

  const whoThisIsFor = Array.isArray(service.whoThisIsFor)
    ? (service.whoThisIsFor as BulletPoint[])
    : []
  const whatsIncluded = Array.isArray(service.whatsIncluded)
    ? (service.whatsIncluded as BulletPoint[])
    : []
  const eligibility = (service.eligibility as string | undefined) ?? ''
  const faq = Array.isArray(service.faq) ? (service.faq as FaqEntry[]) : []

  let nextSection = 1

  return (
    <div className="max-w-[1280px] mx-auto px-6 md:px-8 py-10 flex flex-col gap-12">
      <nav aria-label="Breadcrumb" className="text-sm">
        <a href={`${hrefPrefix}/`}>Home</a> ·{' '}
        <a href={`${hrefPrefix}/services`}>Our services</a> · {service.title as string}
      </nav>

      {isEasyRead && !hasEasyReadContent && <EasyReadNotice pageName="this service" />}

      <ServiceHero
        eyebrow={eyebrow}
        title={service.title as string}
        intro={service.intro ? <p>{service.intro as string}</p> : undefined}
        fundingTypes={(service.fundingTypes as string[]) ?? []}
      />

      {whoThisIsFor.length > 0 && (
        <Section number={nextSection++} title="Who this is for.">
          <KeyPointsBlock
            title="This service suits people who…"
            points={whoThisIsFor.map((p) => p.point)}
          />
        </Section>
      )}

      {whatsIncluded.length > 0 && (
        <Section number={nextSection++} title="What's included.">
          <KeyPointsBlock
            title="What you can expect."
            points={whatsIncluded.map((p) => p.point)}
          />
        </Section>
      )}

      {eligibility && (
        <Section number={nextSection++} title="Eligibility & funding.">
          <p className="text-base leading-relaxed max-w-prose whitespace-pre-line">
            {eligibility}
          </p>
        </Section>
      )}

      {service.content && (
        <Section number={nextSection++} title="More about this service.">
          <RichText value={service.content} />
        </Section>
      )}

      {faq.length > 0 && (
        <Section number={nextSection++} title="Frequently asked questions.">
          <AccordionBlock
            items={faq.map((q, i) => ({
              id: `faq-${i}`,
              heading: q.question,
              body: <p className="whitespace-pre-line">{q.answer}</p>,
            }))}
          />
        </Section>
      )}

      <CTABlock
        eyebrow="Make a start"
        title="Talk to us about this service."
        body="A phone call, an email, or a face-to-face meeting — whatever works for you."
        primary={{ label: 'Make an enquiry.', href: '/enquiry' }}
        secondary={{ label: 'Find a home.', href: '/find-a-home' }}
      />
    </div>
  )
}

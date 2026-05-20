import { notFound } from 'next/navigation'
import { isUrlSlug, urlSlugToLocale } from '@/lib/locale'
import { findOneServiceBySlug } from '@/lib/payload-client'
import { HeadlineBlock } from '@/components/blocks/HeadlineBlock'
import { Tag } from '@/components/primitives/Tag'
import { Section } from '@/components/primitives/Section'
import { RichText } from '@/components/primitives/RichText'

export default async function ServiceDetail({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale: urlLocale, slug } = await params
  if (!isUrlSlug(urlLocale)) notFound()
  const locale = urlSlugToLocale(urlLocale)

  const service = await findOneServiceBySlug(slug, locale)
  if (!service) notFound()

  return (
    <article className="max-w-[1280px] mx-auto px-6 md:px-8 py-10 flex flex-col gap-8">
      <nav aria-label="Breadcrumb" className="text-sm">
        <a href={`/${urlLocale}`}>Home</a> · <a href={`/${urlLocale}/services`}>Our services</a> · {service.title as string}
      </nav>

      <HeadlineBlock
        eyebrow={(service.category as string) ?? ''}
        headline={service.title as string}
      >
        {service.intro && <p>{service.intro as string}</p>}
      </HeadlineBlock>

      {Array.isArray(service.fundingTypes) && service.fundingTypes.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {(service.fundingTypes as string[]).map((f) => (
            <Tag key={f} variant="outline">
              {f.toUpperCase()}
            </Tag>
          ))}
        </div>
      )}

      <Section number={1} title="About this service.">
        <RichText value={service.content} />
      </Section>
    </article>
  )
}

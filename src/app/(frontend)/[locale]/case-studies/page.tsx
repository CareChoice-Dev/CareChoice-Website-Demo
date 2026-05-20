import { notFound } from 'next/navigation'
import { isUrlSlug, urlSlugToLocale } from '@/lib/locale'
import { listCaseStudies } from '@/lib/payload-client'
import { CaseStudyCard } from '@/components/blocks/CaseStudyCard'

export default async function CaseStudiesIndex({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale: urlLocale } = await params
  if (!isUrlSlug(urlLocale)) notFound()
  const locale = urlSlugToLocale(urlLocale)
  const studies = await listCaseStudies(locale)

  return (
    <div className="max-w-[1280px] mx-auto px-6 md:px-8 py-10 flex flex-col gap-8">
      <h1 className="text-4xl md:text-6xl font-bold leading-tight tracking-tight">
        Stories from our community.
      </h1>
      {studies.length === 0 ? (
        <p className="text-lg">Stories will appear here once content is published in the admin.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {studies.map((cs) => (
            <CaseStudyCard
              key={String(cs.id)}
              title={cs.title as string}
              href={`/case-studies/${cs.slug as string}`}
              participantName={cs.participantName as string}
              summary={cs.summary as string}
            />
          ))}
        </div>
      )}
    </div>
  )
}

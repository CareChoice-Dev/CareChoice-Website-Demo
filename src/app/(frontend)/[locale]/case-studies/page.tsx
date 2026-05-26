import { notFound } from 'next/navigation'
import Image from 'next/image'
import { isUrlSlug, urlSlugToLocale } from '@/lib/locale'
import { listCaseStudies } from '@/lib/payload-client'
import { CaseStudyCard } from '@/components/blocks/CaseStudyCard'
import { Module } from '@/components/primitives/Module'
import { Link } from '@/components/primitives/Link'

interface PopulatedMedia {
  url?: string | null
  alt?: string | null
}

function pickHero(value: unknown): PopulatedMedia | null {
  return value && typeof value === 'object' ? (value as PopulatedMedia) : null
}

export default async function CaseStudiesIndex({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale: urlLocale } = await params
  if (!isUrlSlug(urlLocale)) notFound()
  const locale = urlSlugToLocale(urlLocale)
  const studies = await listCaseStudies(locale)

  const hero = studies[0]
  const rest = studies.slice(1)

  return (
    <div className="max-w-[1280px] mx-auto px-6 md:px-8 py-10 flex flex-col gap-10">
      <header className="flex flex-col gap-2">
        <span className="eyebrow">Stories.</span>
        <h1 className="text-4xl md:text-6xl font-bold leading-tight tracking-tight">
          Stories from our community.
        </h1>
        <p className="text-lg leading-relaxed max-w-prose">
          Real outcomes from people we&apos;ve worked with. Names and details published with consent.
        </p>
      </header>

      {studies.length === 0 ? (
        <p className="text-lg">Stories will appear here once content is published in the admin.</p>
      ) : (
        <>
          {hero && (() => {
            const heroPhoto = pickHero(hero.heroImage)
            return (
              <Link
                href={`/case-studies/${hero.slug as string}`}
                className="block no-underline group"
              >
                <Module
                  weight="default"
                  className="grid grid-cols-1 md:grid-cols-2 gap-0 overflow-hidden transition-transform duration-[0.18s] ease-out group-hover:-translate-x-[2px] group-hover:-translate-y-[2px] group-hover:shadow-hard-card motion-reduce:transition-none"
                >
                  <div className="relative aspect-[4/3] md:aspect-auto bg-cc-surface-pink flex items-center justify-center border-r-[7px] border-cc-black overflow-hidden">
                    {heroPhoto?.url ? (
                      <Image
                        src={heroPhoto.url}
                        alt={heroPhoto.alt ?? (hero.title as string)}
                        fill
                        sizes="(min-width: 768px) 50vw, 100vw"
                        className="object-cover"
                        priority
                      />
                    ) : (
                      <span className="eyebrow text-cc-fg-muted">Photo TBA</span>
                    )}
                  </div>
                  <div className="p-8 md:p-12 flex flex-col gap-3 bg-cc-white">
                    {(hero.participantName as string | undefined) && (
                      <span className="eyebrow">{hero.participantName as string}&apos;s story.</span>
                    )}
                    <h2 className="text-3xl md:text-5xl font-bold leading-tight tracking-tight">
                      {hero.title as string}
                    </h2>
                    {hero.summary && (
                      <p className="text-lg leading-relaxed">{hero.summary as string}</p>
                    )}
                    <span className="mt-auto pt-2 font-semibold underline">Read the full story ▸</span>
                  </div>
                </Module>
              </Link>
            )
          })()}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.map((cs) => {
              const photo = pickHero(cs.heroImage)
              return (
                <CaseStudyCard
                  key={String(cs.id)}
                  title={cs.title as string}
                  href={`/case-studies/${cs.slug as string}`}
                  participantName={cs.participantName as string}
                  summary={cs.summary as string}
                  imageUrl={photo?.url ?? undefined}
                  imageAlt={photo?.alt ?? undefined}
                />
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}

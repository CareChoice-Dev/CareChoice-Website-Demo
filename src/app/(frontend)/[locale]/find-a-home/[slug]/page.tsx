import { notFound } from 'next/navigation'
import { headers } from 'next/headers'
import { isUrlSlug } from '@/lib/locale'
import type { SDAVacancy } from '@/components/sda/types'
import { Tag } from '@/components/primitives/Tag'
import { Section } from '@/components/primitives/Section'
import { SDAHeroGallery } from '@/components/sda/SDAHeroGallery'
import { AccessibilityFeaturesGrid } from '@/components/sda/AccessibilityFeaturesGrid'
import { SDAQuickFactsCard } from '@/components/sda/SDAQuickFactsCard'
import { SuburbContextBlock } from '@/components/sda/SuburbContextBlock'
import { SimilarHomesRow } from '@/components/sda/SimilarHomesRow'

async function fetchVacancy(id: string): Promise<SDAVacancy | null> {
  const h = await headers()
  const proto = h.get('x-forwarded-proto') ?? 'http'
  const host = h.get('host') ?? 'localhost:3000'
  const res = await fetch(`${proto}://${host}/api/sda-vacancies`, {
    next: { revalidate: 600 },
  })
  if (!res.ok) return null
  const data: { vacancies: SDAVacancy[] } = await res.json()
  return data.vacancies.find((v) => v.id === id) ?? null
}

export default async function SDADetail({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale: urlLocale, slug } = await params
  if (!isUrlSlug(urlLocale)) notFound()
  const hrefPrefix = `/${urlLocale}`

  const home = await fetchVacancy(slug)
  if (!home) notFound()

  return (
    <div className="max-w-[1280px] mx-auto px-6 md:px-8 py-10 flex flex-col gap-10">
      <nav aria-label="Breadcrumb" className="text-sm">
        <a href={`${hrefPrefix}/`}>Home</a> · <a href={`${hrefPrefix}/find-a-home`}>Find a home</a> · {home.name}
      </nav>

      <header className="flex flex-col gap-3">
        <h1 className="text-4xl md:text-6xl font-bold leading-tight tracking-tight">
          {home.name}
        </h1>
        {home.address.formatted && (
          <p className="text-lg text-cc-fg-muted">{home.address.formatted}</p>
        )}
        <div className="flex flex-wrap gap-2 pt-2">
          {home.designStandard && <Tag>{home.designStandard}</Tag>}
          {home.propertyType && <Tag variant="outline">{home.propertyType}</Tag>}
          {home.region && <Tag variant="pink">{home.region}</Tag>}
          {home.availableBeds > 0 ? (
            <Tag variant="soft">{home.availableBeds} bed{home.availableBeds === 1 ? '' : 's'} available</Tag>
          ) : (
            <Tag variant="outline">Currently full</Tag>
          )}
        </div>
      </header>

      <SDAHeroGallery homeName={home.name} photos={home.photos} />

      <div className="grid grid-cols-1 md:grid-cols-[1fr_360px] gap-10">
        <main className="flex flex-col gap-10">
          {home.description && (
            <Section number={1} title="About this home.">
              <p className="text-base leading-relaxed max-w-prose">{home.description}</p>
            </Section>
          )}

          <Section number={home.description ? 2 : 1} title="Accessibility & amenities.">
            <AccessibilityFeaturesGrid
              amenities={home.amenities}
              accessibility={home.accessibility}
            />
          </Section>

          {home.address.suburb && (
            <Section number={home.description ? 3 : 2} title="The neighbourhood.">
              <SuburbContextBlock suburb={home.address.suburb} />
            </Section>
          )}
        </main>

        <SDAQuickFactsCard home={home} hrefPrefix={hrefPrefix} />
      </div>

      <SimilarHomesRow current={home} hrefPrefix={hrefPrefix} />
    </div>
  )
}

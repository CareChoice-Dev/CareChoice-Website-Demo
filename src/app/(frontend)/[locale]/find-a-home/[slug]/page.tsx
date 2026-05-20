import { notFound } from 'next/navigation'
import { isUrlSlug, urlSlugToLocale } from '@/lib/locale'
import { headers } from 'next/headers'
import type { SDAVacancy } from '@/app/api/sda-vacancies/mapper'
import { Tag } from '@/components/primitives/Tag'
import { Module } from '@/components/primitives/Module'

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
  // Locale unused below for Week 2; will be once content is bilingual
  void urlSlugToLocale(urlLocale)

  const home = await fetchVacancy(slug)
  if (!home) notFound()

  return (
    <article className="max-w-[1280px] mx-auto px-6 md:px-8 py-10 flex flex-col gap-8">
      <header className="flex flex-col gap-3">
        <h1 className="text-4xl md:text-6xl font-bold leading-tight tracking-tight">
          {home.name}
        </h1>
        <p className="text-lg text-cc-fg-muted">{home.address.formatted}</p>
        <div className="flex flex-wrap gap-2 pt-2">
          {home.designStandard && <Tag>{home.designStandard}</Tag>}
          {home.propertyType && <Tag variant="outline">{home.propertyType}</Tag>}
          {home.region && <Tag variant="pink">{home.region}</Tag>}
        </div>
      </header>

      <Module weight="card" className="p-6 flex flex-wrap gap-8">
        <div>
          <span className="eyebrow">Active beds.</span>
          <p className="text-3xl font-bold">{home.activeBeds}</p>
        </div>
        <div>
          <span className="eyebrow">Currently occupied.</span>
          <p className="text-3xl font-bold">{home.occupiedBeds}</p>
        </div>
        <div>
          <span className="eyebrow">Vacant.</span>
          <p className="text-3xl font-bold text-cc-magenta">{home.availableBeds}</p>
        </div>
      </Module>

      {home.amenities.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-3">Amenities.</h2>
          <ul className="flex flex-wrap gap-2">
            {home.amenities.map((a) => (
              <li key={a}>
                <Tag variant="outline">{a}</Tag>
              </li>
            ))}
          </ul>
        </section>
      )}

      {home.description && (
        <section>
          <h2 className="text-2xl font-bold mb-3">About this home.</h2>
          <p className="text-base leading-relaxed max-w-prose">{home.description}</p>
        </section>
      )}

      {home.sharepointUrl && (
        <p className="text-sm">
          Photos and floorplans:{' '}
          <a href={home.sharepointUrl} className="underline">
            SharePoint folder
          </a>
        </p>
      )}
    </article>
  )
}

import { headers } from 'next/headers'
import { SDAHomeCard } from './SDAHomeCard'
import type { SDAVacancy } from './types'

async function fetchVacancies(): Promise<SDAVacancy[]> {
  const h = await headers()
  const proto = h.get('x-forwarded-proto') ?? 'http'
  const host = h.get('host') ?? 'localhost:3000'
  const res = await fetch(`${proto}://${host}/api/sda-vacancies`, {
    next: { revalidate: 30, tags: ['sda-vacancies'] },
  })
  if (!res.ok) return []
  const data: { vacancies: SDAVacancy[] } = await res.json()
  return data.vacancies
}

function similarityScore(a: SDAVacancy, b: SDAVacancy): number {
  let score = 0
  if (a.region && a.region === b.region) score += 2
  if (a.designStandard && a.designStandard === b.designStandard) score += 2
  if (a.propertyType && a.propertyType === b.propertyType) score += 1
  if (b.availableBeds > 0) score += 1
  return score
}

export async function SimilarHomesRow({
  current,
  hrefPrefix,
}: {
  current: SDAVacancy
  hrefPrefix: string
}) {
  const all = await fetchVacancies()
  const others = all
    .filter((v) => v.id !== current.id)
    .map((v) => ({ home: v, score: similarityScore(current, v) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((s) => s.home)

  if (others.length === 0) return null

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-2xl md:text-3xl font-bold leading-tight">Similar homes.</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {others.map((h) => (
          <SDAHomeCard key={h.id} home={h} hrefPrefix={hrefPrefix} />
        ))}
      </div>
    </section>
  )
}

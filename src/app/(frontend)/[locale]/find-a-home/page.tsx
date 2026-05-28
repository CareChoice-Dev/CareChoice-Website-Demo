import { notFound } from 'next/navigation'
import { headers } from 'next/headers'
import { Suspense } from 'react'
import { isUrlSlug } from '@/lib/locale'
import type { SDAVacancy } from '@/components/sda/types'
import { SDAResults } from '@/components/sda/SDAResults'
import { HelpMeFindAHome } from '@/components/findhome/HelpMeFindAHome'
import { geocodeAddress } from '@/lib/geocode'

async function fetchAllVacancies(): Promise<{
  vacancies: SDAVacancy[]
  source: string
}> {
  const h = await headers()
  const proto = h.get('x-forwarded-proto') ?? 'http'
  const host = h.get('host') ?? 'localhost:3000'
  // See [slug]/page.tsx for rationale on no-store.
  const res = await fetch(`${proto}://${host}/api/sda-vacancies`, {
    cache: 'no-store',
  })
  if (!res.ok) {
    return { vacancies: [], source: 'error' }
  }
  return res.json()
}

async function attachGeoFallback(vacancies: SDAVacancy[]): Promise<SDAVacancy[]> {
  // For records where Salesforce gave us no geo, try to geocode the formatted address.
  // Throttle to ~1 req/sec via sequential awaits — Nominatim's free tier requires this.
  const enriched: SDAVacancy[] = []
  for (const v of vacancies) {
    if (v.geo || !v.address.formatted) {
      enriched.push(v)
      continue
    }
    const geo = await geocodeAddress(v.address.formatted + ', Australia')
    enriched.push(geo ? { ...v, geo } : v)
  }
  return enriched
}

export default async function FindAHome({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale: urlLocale } = await params
  if (!isUrlSlug(urlLocale)) notFound()

  const { vacancies, source } = await fetchAllVacancies()
  const enriched = await attachGeoFallback(vacancies)
  const hrefPrefix = `/${urlLocale}`

  return (
    <div className="max-w-[1280px] mx-auto px-6 md:px-8 py-10 flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <h1 className="text-4xl md:text-6xl font-bold leading-tight tracking-tight">
          Find a home.
        </h1>
        <p className="text-lg max-w-prose">
          Vacancies updated every 10 minutes from our Salesforce site directory.
          {enriched.length > 0 && ` ${enriched.length} homes in this view.`}
        </p>
      </header>

      <HelpMeFindAHome hrefPrefix={hrefPrefix} />

      <Suspense fallback={<p className="text-sm text-cc-fg-muted">Loading homes…</p>}>
        <SDAResults vacancies={enriched} hrefPrefix={hrefPrefix} />
      </Suspense>

      {source !== 'salesforce' && (
        <p className="text-xs text-cc-fg-muted">
          Source: {source}. Salesforce connection is currently
          {source === 'fallback' ? ' unavailable; showing seeded data' : ' in error'}.
        </p>
      )}
    </div>
  )
}

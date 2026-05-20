import { notFound } from 'next/navigation'
import { headers } from 'next/headers'
import { isUrlSlug } from '@/lib/locale'
import type { SDAVacancy } from '@/components/sda/types'
import { SDAGrid } from '@/components/sda/SDAGrid'

async function fetchAllVacancies(): Promise<{
  vacancies: SDAVacancy[]
  source: string
}> {
  const h = await headers()
  const proto = h.get('x-forwarded-proto') ?? 'http'
  const host = h.get('host') ?? 'localhost:3000'
  const res = await fetch(`${proto}://${host}/api/sda-vacancies`, {
    next: { revalidate: 600 },
  })
  if (!res.ok) {
    return { vacancies: [], source: 'error' }
  }
  return res.json()
}

export default async function FindAHome({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale: urlLocale } = await params
  if (!isUrlSlug(urlLocale)) notFound()

  const { vacancies, source } = await fetchAllVacancies()
  const hrefPrefix = `/${urlLocale}`

  return (
    <div className="max-w-[1280px] mx-auto px-6 md:px-8 py-10 flex flex-col gap-6">
      <header>
        <h1 className="text-4xl md:text-6xl font-bold leading-tight tracking-tight">
          Find a home.
        </h1>
        <p className="text-lg mt-2 max-w-prose">
          Vacancies updated every 10 minutes from our Salesforce site directory.
        </p>
      </header>

      <SDAGrid vacancies={vacancies} hrefPrefix={hrefPrefix} />

      {source !== 'salesforce' && (
        <p className="text-xs text-cc-fg-muted">
          Source: {source}. Salesforce connection is currently {source === 'fallback' ? 'unavailable; showing seeded data' : 'in error'}.
        </p>
      )}
    </div>
  )
}

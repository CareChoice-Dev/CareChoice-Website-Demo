import { notFound } from 'next/navigation'
import { isUrlSlug } from '@/lib/locale'
import { SearchUI } from '@/components/search/SearchUI'

export default async function SearchPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale: urlLocale } = await params
  if (!isUrlSlug(urlLocale)) notFound()

  return (
    <div className="max-w-[800px] mx-auto px-6 md:px-8 py-10 flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-4xl md:text-6xl font-bold leading-tight tracking-tight">Search.</h1>
        <p className="text-lg leading-relaxed">
          Search across services, case studies, and pages. SDA home listings are live from Salesforce
          and show up via the &ldquo;Find a home&rdquo; page rather than search.
        </p>
      </header>

      <SearchUI />
    </div>
  )
}

import { notFound } from 'next/navigation'
import { isUrlSlug } from '@/lib/locale'
import { SearchUI } from '@/components/search/SearchUI'
import { AskCCTrigger } from '@/components/ask/AskCCTrigger'

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

      <aside
        aria-labelledby="ask-cc-cta-heading"
        className="border-4 border-cc-black bg-cc-surface-pink p-6 flex flex-col gap-3"
      >
        <p className="eyebrow text-cc-magenta">Faster than searching.</p>
        <h2 id="ask-cc-cta-heading" className="text-2xl md:text-3xl font-bold leading-tight">
          Try Ask CareChoice for a direct answer.
        </h2>
        <p className="text-base leading-relaxed">
          Ask in your own words — services, available homes, or how to enquire. Replies come with
          links to the source pages so you can read deeper.
        </p>
        <div>
          <AskCCTrigger variant="header-icon" />
        </div>
      </aside>
    </div>
  )
}

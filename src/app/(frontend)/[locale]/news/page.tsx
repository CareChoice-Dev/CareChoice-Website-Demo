import { notFound } from 'next/navigation'
import { isUrlSlug, urlSlugToLocale } from '@/lib/locale'
import { listNews } from '@/lib/payload-client'
import { Link } from '@/components/primitives/Link'

export default async function NewsIndex({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale: urlLocale } = await params
  if (!isUrlSlug(urlLocale)) notFound()
  const locale = urlSlugToLocale(urlLocale)
  const news = await listNews(locale)

  return (
    <div className="max-w-[1280px] mx-auto px-6 md:px-8 py-10 flex flex-col gap-8">
      <h1 className="text-4xl md:text-6xl font-bold leading-tight tracking-tight">In the news.</h1>
      {news.length === 0 ? (
        <p className="text-lg">News articles will appear here once published.</p>
      ) : (
        <ul className="flex flex-col gap-6">
          {news.map((n) => (
            <li key={String(n.id)} className="border-b-2 border-cc-black pb-4">
              <Link href={`/news/${n.slug as string}`} className="block group">
                <span className="eyebrow">
                  {n.publishDate
                    ? new Date(n.publishDate as string).toLocaleDateString('en-AU')
                    : 'News'}
                  .
                </span>
                <h2 className="text-2xl md:text-3xl font-bold group-hover:underline">
                  {n.title as string}
                </h2>
                {n.excerpt && <p className="mt-2 text-base">{n.excerpt as string}</p>}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

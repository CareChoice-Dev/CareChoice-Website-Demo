import { notFound } from 'next/navigation'
import Image from 'next/image'
import { isUrlSlug, urlSlugToLocale } from '@/lib/locale'
import { listNews } from '@/lib/payload-client'
import { Link } from '@/components/primitives/Link'

interface PopulatedMedia {
  url?: string | null
  alt?: string | null
}

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
          {news.map((n) => {
            const hero =
              n.heroImage && typeof n.heroImage === 'object'
                ? (n.heroImage as PopulatedMedia)
                : null
            return (
              <li key={String(n.id)} className="border-b-2 border-cc-black pb-6">
                <Link href={`/news/${n.slug as string}`} className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6 group no-underline">
                  {hero?.url ? (
                    <div className="relative aspect-[4/3] border-2 border-cc-black overflow-hidden">
                      <Image
                        src={hero.url}
                        alt={hero.alt ?? (n.title as string)}
                        fill
                        sizes="(min-width: 768px) 240px, 100vw"
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="aspect-[4/3] bg-cc-surface-pink border-2 border-cc-black flex items-center justify-center">
                      <span className="eyebrow text-cc-fg-muted">Photo TBA</span>
                    </div>
                  )}
                  <div className="flex flex-col gap-2">
                    <span className="eyebrow">
                      {n.publishDate
                        ? new Date(n.publishDate as string).toLocaleDateString('en-AU')
                        : 'News'}
                      .
                    </span>
                    <h2 className="text-2xl md:text-3xl font-bold group-hover:underline">
                      {n.title as string}
                    </h2>
                    {n.excerpt && <p className="mt-1 text-base">{n.excerpt as string}</p>}
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

import { notFound } from 'next/navigation'
import Image from 'next/image'
import { isUrlSlug, urlSlugToLocale } from '@/lib/locale'
import { findOneNewsBySlug, getPayloadClient } from '@/lib/payload-client'
import { RichText } from '@/components/primitives/RichText'

interface PopulatedMedia {
  url?: string | null
  alt?: string | null
}

export async function generateStaticParams() {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'news',
    limit: 50,
    locale: 'en',
  })
  return result.docs
    .filter((d): d is typeof d & { slug: string } => typeof d.slug === 'string')
    .flatMap((d) => [
      { locale: 'en', slug: d.slug },
      { locale: 'vi', slug: d.slug },
      { locale: 'zh', slug: d.slug },
      { locale: 'easy-read', slug: d.slug },
    ])
}

export default async function NewsArticle({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale: urlLocale, slug } = await params
  if (!isUrlSlug(urlLocale)) notFound()
  const locale = urlSlugToLocale(urlLocale)

  const article = await findOneNewsBySlug(slug, locale)
  if (!article) notFound()

  const date = article.publishDate
    ? new Date(article.publishDate as string).toLocaleDateString('en-AU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : null

  const hero =
    article.heroImage && typeof article.heroImage === 'object'
      ? (article.heroImage as PopulatedMedia)
      : null

  return (
    <article className="max-w-[800px] mx-auto px-6 md:px-8 py-10 flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <span className="eyebrow">{date ?? 'News'}.</span>
        <h1 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight">
          {article.title as string}
        </h1>
        {article.author && (
          <p className="text-sm text-cc-fg-muted">By {article.author as string}</p>
        )}
      </header>

      {hero?.url && (
        <div className="relative aspect-[16/9] border-2 border-cc-black shadow-hard-card overflow-hidden">
          <Image
            src={hero.url}
            alt={hero.alt ?? (article.title as string)}
            fill
            sizes="(min-width: 1024px) 800px, 100vw"
            className="object-cover"
            priority
          />
        </div>
      )}

      {article.excerpt && (
        <p className="text-lg leading-relaxed">{article.excerpt as string}</p>
      )}

      <RichText value={article.body} />
    </article>
  )
}

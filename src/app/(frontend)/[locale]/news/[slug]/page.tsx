import { notFound } from 'next/navigation'
import { isUrlSlug, urlSlugToLocale } from '@/lib/locale'
import { findOneNewsBySlug } from '@/lib/payload-client'
import { RichText } from '@/components/primitives/RichText'

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

      {article.excerpt && (
        <p className="text-lg leading-relaxed">{article.excerpt as string}</p>
      )}

      <RichText value={article.body} />
    </article>
  )
}

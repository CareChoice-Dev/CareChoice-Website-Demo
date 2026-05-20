import { notFound } from 'next/navigation'
import { isUrlSlug, urlSlugToLocale } from '@/lib/locale'
import { findOneCaseStudyBySlug } from '@/lib/payload-client'
import { RichText } from '@/components/primitives/RichText'

export default async function CaseStudyDetail({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale: urlLocale, slug } = await params
  if (!isUrlSlug(urlLocale)) notFound()
  const locale = urlSlugToLocale(urlLocale)

  const story = await findOneCaseStudyBySlug(slug, locale)
  if (!story) notFound()

  return (
    <article className="max-w-[1280px] mx-auto px-6 md:px-8 py-10 flex flex-col gap-8">
      <header className="flex flex-col gap-3">
        <span className="eyebrow">{(story.participantName as string) ?? 'Story'}.</span>
        <h1 className="text-4xl md:text-6xl font-bold leading-tight tracking-tight">
          {story.title as string}
        </h1>
        {story.summary && (
          <p className="text-lg leading-relaxed max-w-3xl">{story.summary as string}</p>
        )}
      </header>

      {story.quote && (
        <blockquote className="text-2xl italic max-w-3xl border-l-4 border-cc-magenta pl-6">
          {story.quote as string}
        </blockquote>
      )}

      <RichText value={story.story} />
    </article>
  )
}

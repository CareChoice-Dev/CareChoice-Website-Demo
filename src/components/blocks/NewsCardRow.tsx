import { Link } from '@/components/primitives/Link'
import { Module } from '@/components/primitives/Module'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { PayloadLocale } from '@/lib/locale'

interface NewsDoc {
  id: number | string
  title: string
  slug: string
  publishDate?: string
  excerpt?: string
}

export async function NewsCardRow({ locale, limit = 3 }: { locale: PayloadLocale; limit?: number }) {
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'news',
    locale,
    fallbackLocale: 'en',
    limit,
    sort: '-publishDate',
  })
  const news = result.docs as unknown as NewsDoc[]

  if (news.length === 0) {
    return <p className="text-base text-cc-fg-muted">News will appear here once published.</p>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {news.map((n) => {
        const date = n.publishDate
          ? new Date(n.publishDate).toLocaleDateString('en-AU', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })
          : ''
        return (
          <Link key={String(n.id)} href={`/news/${n.slug}`} className="no-underline group">
            <Module
              weight="card"
              className="p-5 h-full flex flex-col gap-2 transition-transform duration-[0.18s] ease-out group-hover:-translate-x-[2px] group-hover:-translate-y-[2px] group-hover:shadow-hard-card motion-reduce:transition-none"
            >
              {date && <span className="eyebrow">{date}.</span>}
              <h4 className="text-xl font-bold leading-tight">{n.title}</h4>
              {n.excerpt && <p className="text-sm text-cc-fg-muted line-clamp-3">{n.excerpt}</p>}
            </Module>
          </Link>
        )
      })}
    </div>
  )
}

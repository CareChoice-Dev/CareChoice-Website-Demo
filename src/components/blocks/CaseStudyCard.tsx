import { Link } from '@/components/primitives/Link'
import { Module } from '@/components/primitives/Module'

export interface CaseStudyCardProps {
  title: string
  href: string
  summary?: string
  participantName?: string
  imageUrl?: string
  imageAlt?: string
}

export async function CaseStudyCard({
  title,
  href,
  summary,
  participantName,
  imageUrl,
  imageAlt,
}: CaseStudyCardProps) {
  return (
    <Link href={href} className="block no-underline group">
      <Module
        weight="card"
        className="overflow-hidden h-full flex flex-col transition-transform duration-[0.18s] ease-out group-hover:-translate-x-[2px] group-hover:-translate-y-[2px] group-hover:shadow-hard-card motion-reduce:transition-none"
      >
        {imageUrl && (
          <div className="aspect-[4/3] bg-cc-surface-pink border-b-[7px] border-cc-black">
            <img src={imageUrl} alt={imageAlt ?? ''} className="w-full h-full object-cover" />
          </div>
        )}
        <div className="p-6 flex flex-col gap-3">
          {participantName && <span className="eyebrow">{participantName}&apos;s story.</span>}
          <h3 className="text-2xl font-bold leading-tight">{title}</h3>
          {summary && <p className="text-base leading-relaxed">{summary}</p>}
        </div>
      </Module>
    </Link>
  )
}

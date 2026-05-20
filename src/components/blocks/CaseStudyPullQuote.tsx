export interface CaseStudyPullQuoteProps {
  quote: string
  attribution?: string
}

export function CaseStudyPullQuote({ quote, attribution }: CaseStudyPullQuoteProps) {
  return (
    <figure className="max-w-3xl mx-auto my-10 border-l-4 border-cc-magenta pl-6 md:pl-8">
      <blockquote className="text-2xl md:text-3xl italic leading-snug font-semibold tracking-tight">
        &ldquo;{quote}&rdquo;
      </blockquote>
      {attribution && (
        <figcaption className="mt-4 text-sm font-semibold uppercase tracking-wider text-cc-fg-muted">
          — {attribution}
        </figcaption>
      )}
    </figure>
  )
}

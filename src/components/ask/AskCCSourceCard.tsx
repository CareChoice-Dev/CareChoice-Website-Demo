'use client'

import NextLink from 'next/link'

export interface AskCCSourceCardProps {
  label: string
  href: string
  description?: string
  /** Optional eyebrow override; defaults to "Read more". */
  eyebrow?: string
}

/**
 * Compact link card rendered beneath an agent message in the AskCC panel.
 * Stays within the panel locale via the existing /<locale>/<...> prefix that the
 * caller is expected to provide; AskCC.tsx wires the current locale into the href.
 */
export function AskCCSourceCard({
  label,
  href,
  description,
  eyebrow = 'Read more',
}: AskCCSourceCardProps) {
  return (
    <NextLink
      href={href}
      className="block no-underline border-2 border-cc-black bg-cc-white px-3 py-2 transition-transform duration-[0.15s] ease-out hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-hard-card focus-visible:outline-2 focus-visible:outline-cc-magenta focus-visible:outline-offset-2 motion-reduce:transition-none"
    >
      <p className="eyebrow text-xs text-cc-fg-muted mb-0.5">{eyebrow}</p>
      <p className="text-sm font-bold leading-tight text-cc-black">
        {label} <span aria-hidden>→</span>
      </p>
      {description && (
        <p className="text-xs text-cc-fg-muted leading-snug mt-0.5">{description}</p>
      )}
    </NextLink>
  )
}

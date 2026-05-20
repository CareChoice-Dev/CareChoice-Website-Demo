import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

export interface HeadlineBlockProps {
  eyebrow?: string
  headline: string
  children?: ReactNode
  className?: string
}

export function HeadlineBlock({ eyebrow, headline, children, className }: HeadlineBlockProps) {
  return (
    <div className={cn('py-10 md:py-16 flex flex-col gap-4 max-w-3xl', className)}>
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h2 className="text-3xl md:text-5xl font-bold leading-tight tracking-tight">{headline}</h2>
      {children && <div className="text-lg leading-relaxed">{children}</div>}
    </div>
  )
}

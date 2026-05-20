import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

export interface SectionProps {
  /** Two-digit numeric label, e.g. "01", "02". Pass without leading zero — component pads. */
  number?: string | number
  title: string
  rightSlot?: ReactNode
  children?: ReactNode
  className?: string
}

export function Section({ number, title, rightSlot, children, className }: SectionProps) {
  const numberLabel =
    typeof number === 'number'
      ? number.toString().padStart(2, '0')
      : number?.padStart(2, '0')

  return (
    <section className={cn('py-12', className)}>
      <div className="flex items-baseline gap-4 mb-6 pb-3 border-b-2 border-cc-black">
        {numberLabel && (
          <span className="eyebrow" style={{ color: 'var(--cc-pms-675)' }}>{numberLabel}</span>
        )}
        <h2 className="text-2xl md:text-4xl font-bold leading-tight">{title}</h2>
        {rightSlot && <div className="ml-auto">{rightSlot}</div>}
      </div>
      {children}
    </section>
  )
}

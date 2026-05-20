import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

export type TagVariant = 'solid' | 'soft' | 'outline' | 'pink'

const VARIANT: Record<TagVariant, string> = {
  solid: 'bg-cc-magenta text-white border-2 border-cc-magenta',
  soft: 'bg-cc-magenta-60 text-cc-black border-2 border-cc-magenta-60',
  outline: 'bg-transparent text-cc-black border-2 border-cc-black',
  pink: 'bg-cc-surface-pink text-cc-black border-2 border-cc-surface-pink',
}

export interface TagProps {
  variant?: TagVariant
  children?: ReactNode
  className?: string
}

export function Tag({ variant = 'solid', children, className }: TagProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-3 py-1 rounded-none text-[13px] font-semibold uppercase tracking-wider',
        VARIANT[variant],
        className,
      )}
    >
      {children}
    </span>
  )
}

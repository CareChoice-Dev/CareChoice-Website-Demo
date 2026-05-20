import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/cn'

export type ModuleWeight = 'default' | 'card' | 'thin'
export type ModuleFill = 'none' | 'magenta' | 'magenta-60' | 'surface-pink' | 'black'

const BORDER_WEIGHT: Record<ModuleWeight, string> = {
  default: 'border-[7px]',
  card: 'border-4',
  thin: 'border-2',
}

const FILL: Record<ModuleFill, string> = {
  none: 'bg-cc-white text-cc-black',
  magenta: 'bg-cc-magenta text-white',
  'magenta-60': 'bg-cc-magenta-60 text-cc-black',
  'surface-pink': 'bg-cc-surface-pink text-cc-black',
  black: 'bg-cc-black text-white',
}

export interface ModuleProps extends HTMLAttributes<HTMLDivElement> {
  weight?: ModuleWeight
  fill?: ModuleFill
  children?: ReactNode
}

export function Module({
  weight = 'default',
  fill = 'none',
  className,
  children,
  ...rest
}: ModuleProps) {
  return (
    <div
      className={cn(
        'rounded-none border-cc-black',
        BORDER_WEIGHT[weight],
        FILL[fill],
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  )
}

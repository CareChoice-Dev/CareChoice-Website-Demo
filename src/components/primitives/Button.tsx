import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/cn'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost'
export type ButtonSize = 'md' | 'lg'

const BASE =
  'inline-flex items-center justify-center gap-2 font-semibold border-2 border-cc-black rounded-none transition-[transform,box-shadow,background-color] duration-[0.15s] ease-linear motion-reduce:transition-none focus:outline-none focus-visible:outline-2 focus-visible:outline-cc-magenta focus-visible:outline-offset-2'

const VARIANT: Record<ButtonVariant, string> = {
  primary:
    'bg-cc-magenta text-white hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-hard-btn active:translate-x-0 active:translate-y-0 active:shadow-none active:bg-cc-pms-675',
  secondary:
    'bg-white text-cc-black hover:bg-cc-magenta-60',
  ghost:
    'bg-transparent border-transparent text-cc-black hover:bg-cc-surface-pink hover:underline',
}

const SIZE: Record<ButtonSize, string> = {
  md: 'min-h-[44px] px-5 text-base',
  lg: 'min-h-[56px] px-7 text-lg',
}

type CommonProps = {
  variant?: ButtonVariant
  size?: ButtonSize
  children?: ReactNode
  className?: string
}

type ButtonAsButton = CommonProps & ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined }
type ButtonAsAnchor = CommonProps & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }

export type ButtonProps = ButtonAsButton | ButtonAsAnchor

export function Button(props: ButtonProps) {
  const { variant = 'primary', size = 'md', className, children, ...rest } = props
  const classes = cn(BASE, VARIANT[variant], SIZE[size], className)

  if ('href' in props && typeof props.href === 'string') {
    const { href, ...anchorRest } = rest as AnchorHTMLAttributes<HTMLAnchorElement>
    return (
      <a href={href} className={classes} {...anchorRest}>
        {children}
      </a>
    )
  }

  return (
    <button className={classes} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  )
}

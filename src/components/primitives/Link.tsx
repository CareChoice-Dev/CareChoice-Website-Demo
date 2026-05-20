import NextLink, { type LinkProps as NextLinkProps } from 'next/link'
import { headers } from 'next/headers'
import type { ReactNode } from 'react'
import { isUrlSlug } from '@/lib/locale'

export interface LinkProps extends Omit<NextLinkProps, 'href'> {
  href: string
  children?: ReactNode
  className?: string
}

/**
 * Locale-aware Link.
 * - http(s)/mailto/tel hrefs: external, used as-is.
 * - hrefs starting with `/`: prefixed with the current locale (from x-locale header)
 *   UNLESS the path already starts with a known locale slug.
 * - Anything else: passed through.
 */
export async function Link({ href, children, ...rest }: LinkProps) {
  let target = href

  const isExternal =
    href.startsWith('http://') ||
    href.startsWith('https://') ||
    href.startsWith('mailto:') ||
    href.startsWith('tel:')

  if (!isExternal && href.startsWith('/')) {
    const firstSegment = href.split('/')[1]
    if (!firstSegment || !isUrlSlug(firstSegment)) {
      const h = await headers()
      const xLocaleHeader = h.get('x-locale') ?? 'en'
      const urlSlug = xLocaleHeader === 'en-easy-read' ? 'easy-read' : xLocaleHeader
      target = `/${urlSlug}${href === '/' ? '' : href}`
    }
  }

  return (
    <NextLink href={target} {...rest}>
      {children}
    </NextLink>
  )
}

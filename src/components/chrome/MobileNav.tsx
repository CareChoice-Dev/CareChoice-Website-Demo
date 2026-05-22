'use client'

import { useEffect, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import NextLink from 'next/link'
import { cn } from '@/lib/cn'

export interface MobileNavChild {
  label: string
  url: string
  description?: string
}

export interface MobileNavItem {
  label: string
  url: string
  highlightAsCta?: boolean
  children?: MobileNavChild[]
}

export interface MobileNavProps {
  items: MobileNavItem[]
  hrefPrefix: string
}

/**
 * Collapsible mobile navigation. Hidden at md+; the desktop Header takes over.
 *
 * Each top-level item with children renders as a disclosure (button +
 * collapsible list). Items without children render as a plain link.
 */
export function MobileNav({ items, hrefPrefix }: MobileNavProps) {
  const [open, setOpen] = useState(false)
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

  // Close drawer when the route changes (basic: when the user clicks any link)
  useEffect(() => {
    if (!open) return
    function handleEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [open])

  function buildHref(url: string): string {
    if (/^(https?:|mailto:|tel:)/.test(url)) return url
    if (!url.startsWith('/')) return url
    const first = url.split('/')[1]
    if (first && ['en', 'vi', 'zh', 'easy-read'].includes(first)) return url
    return `${hrefPrefix}${url === '/' ? '' : url}`
  }

  function closeAll() {
    setOpen(false)
    setExpandedIndex(null)
  }

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-nav-panel"
        aria-label={open ? 'Close menu' : 'Open menu'}
        onClick={() => setOpen((v) => !v)}
        className="flex items-center justify-center w-11 h-11 border-2 border-cc-black bg-cc-white font-semibold"
      >
        {open ? '✕' : 'Menu'}
      </button>

      {open && (
        <div
          id="mobile-nav-panel"
          className="absolute left-0 right-0 top-full z-30 bg-cc-white border-y-2 border-cc-black shadow-hard-card"
        >
          <ul className="flex flex-col">
            {items.map((item, i) => {
              const hasChildren = Array.isArray(item.children) && item.children.length > 0
              const isExpanded = expandedIndex === i

              if (!hasChildren) {
                return (
                  <li key={`${item.url}-${i}`} className="border-b-2 border-cc-black last:border-b-0">
                    <NextLink
                      href={buildHref(item.url)}
                      onClick={closeAll}
                      className={cn(
                        'block px-5 py-4 font-semibold no-underline hover:bg-cc-surface-pink',
                        item.highlightAsCta && 'bg-cc-magenta text-white hover:bg-cc-pms-675',
                      )}
                    >
                      {item.label}
                    </NextLink>
                  </li>
                )
              }

              return (
                <li key={`${item.url}-${i}`} className="border-b-2 border-cc-black last:border-b-0">
                  <button
                    type="button"
                    aria-expanded={isExpanded}
                    onClick={() => setExpandedIndex(isExpanded ? null : i)}
                    className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left font-semibold hover:bg-cc-surface-pink"
                  >
                    <span>{item.label}</span>
                    <ChevronDown
                      className={cn(
                        'w-5 h-5 transition-transform duration-[0.15s] motion-reduce:transition-none',
                        isExpanded && 'rotate-180',
                      )}
                      aria-hidden="true"
                    />
                  </button>

                  {isExpanded && (
                    <ul className="bg-cc-surface-pink border-t-2 border-cc-black">
                      <li className="border-b-2 border-cc-black">
                        <NextLink
                          href={buildHref(item.url)}
                          onClick={closeAll}
                          className="block px-7 py-3 text-sm font-semibold no-underline"
                        >
                          View all {item.label.toLowerCase()} →
                        </NextLink>
                      </li>
                      {item.children!.map((child, j) => (
                        <li
                          key={`${child.url}-${j}`}
                          className="border-b-2 border-cc-black last:border-b-0"
                        >
                          <NextLink
                            href={buildHref(child.url)}
                            onClick={closeAll}
                            className="block px-7 py-3 no-underline"
                          >
                            <span className="block font-semibold">{child.label}</span>
                            {child.description && (
                              <span className="block text-sm text-cc-fg-muted">
                                {child.description}
                              </span>
                            )}
                          </NextLink>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}

'use client'

import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react'
import { ChevronDown } from 'lucide-react'
import NextLink from 'next/link'
import { cn } from '@/lib/cn'

export interface DropdownChild {
  label: string
  url: string
  description?: string
}

export interface ServicesDropdownProps {
  /** Top-level label, e.g. "Disability Services". */
  label: string
  /** Optional URL the parent label itself links to when the user clicks it directly. */
  parentUrl?: string
  /** Child items shown in the dropdown panel. */
  items: DropdownChild[]
  /** Locale prefix (e.g. "/en") so internal URLs work in the Link. */
  hrefPrefix: string
  className?: string
}

/**
 * Accessible header dropdown — keyboard-managed disclosure pattern.
 *
 * - Button has aria-expanded + aria-controls.
 * - Opens on click or Enter/Space.
 * - Closes on outside click, Esc, or focus leaving the panel.
 * - Arrow Down/Up moves focus through child items.
 *
 * Hand-rolled (no Radix in deps) but covers the same a11y bases used in
 * shadcn/ui's DropdownMenu — minus the floating-ui positioning, which we
 * don't need (the panel sits directly below the trigger).
 */
export function ServicesDropdown({
  label,
  parentUrl,
  items,
  hrefPrefix,
  className,
}: ServicesDropdownProps) {
  const [open, setOpen] = useState(false)
  const panelId = useId()
  const containerRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<Array<HTMLAnchorElement | null>>([])

  useEffect(() => {
    if (!open) return

    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }

    function handleEsc(e: globalThis.KeyboardEvent) {
      if (e.key === 'Escape') {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEsc)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEsc)
    }
  }, [open])

  function handleTriggerKeyDown(e: KeyboardEvent<HTMLButtonElement>) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setOpen(true)
      // focus first item after panel opens
      requestAnimationFrame(() => itemRefs.current[0]?.focus())
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  function handleItemKeyDown(e: KeyboardEvent<HTMLAnchorElement>, index: number) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      const next = itemRefs.current[(index + 1) % itemRefs.current.length]
      next?.focus()
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      const prev =
        itemRefs.current[(index - 1 + itemRefs.current.length) % itemRefs.current.length]
      prev?.focus()
    } else if (e.key === 'Escape') {
      e.preventDefault()
      setOpen(false)
      // return focus to trigger
      const trigger = containerRef.current?.querySelector('button')
      ;(trigger as HTMLButtonElement | null)?.focus()
    } else if (e.key === 'Tab') {
      // allow normal tab — close panel
      setOpen(false)
    }
  }

  function buildHref(url: string): string {
    // External or already-locale-prefixed: leave alone.
    if (/^(https?:|mailto:|tel:)/.test(url)) return url
    if (!url.startsWith('/')) return url
    const first = url.split('/')[1]
    if (first && ['en', 'vi', 'zh', 'easy-read'].includes(first)) return url
    return `${hrefPrefix}${url === '/' ? '' : url}`
  }

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-haspopup="menu"
        onClick={() => setOpen((v) => !v)}
        onKeyDown={handleTriggerKeyDown}
        className="flex items-center gap-1 font-semibold no-underline hover:underline"
      >
        <span>{label}</span>
        <ChevronDown
          className={cn(
            'w-4 h-4 transition-transform duration-[0.15s] motion-reduce:transition-none',
            open && 'rotate-180',
          )}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div
          id={panelId}
          role="menu"
          aria-label={label}
          className="absolute left-0 top-full mt-2 z-30 w-[320px] border-2 border-cc-black bg-cc-white shadow-hard-card"
        >
          {parentUrl && (
            <NextLink
              href={buildHref(parentUrl)}
              role="menuitem"
              className="block px-4 py-3 border-b-2 border-cc-black text-sm font-semibold hover:bg-cc-surface-pink focus:bg-cc-surface-pink focus:outline-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-cc-magenta"
              onClick={() => setOpen(false)}
            >
              View all {label.toLowerCase()} →
            </NextLink>
          )}
          <ul className="flex flex-col">
            {items.map((child, i) => (
              <li key={`${child.url}-${i}`}>
                <NextLink
                  ref={(el) => {
                    itemRefs.current[i] = el
                  }}
                  href={buildHref(child.url)}
                  role="menuitem"
                  onClick={() => setOpen(false)}
                  onKeyDown={(e) => handleItemKeyDown(e, i)}
                  className="block px-4 py-3 border-b-2 border-cc-black last:border-b-0 hover:bg-cc-surface-pink focus:bg-cc-surface-pink focus:outline-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-cc-magenta"
                >
                  <span className="block font-semibold">{child.label}</span>
                  {child.description && (
                    <span className="block text-sm text-cc-fg-muted mt-0.5">
                      {child.description}
                    </span>
                  )}
                </NextLink>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

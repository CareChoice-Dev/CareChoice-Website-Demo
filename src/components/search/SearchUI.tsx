'use client'

import { useEffect, useRef, useState } from 'react'
import { Module } from '@/components/primitives/Module'

interface PagefindResult {
  url: string
  excerpt: string
  meta: { title: string; image?: string }
}

interface PagefindAPI {
  search: (query: string) => Promise<{
    results: Array<{
      id: string
      data: () => Promise<PagefindResult>
    }>
  }>
}

declare global {
  interface Window {
    pagefind?: PagefindAPI
  }
}

type FilterKey = 'services' | 'case-studies' | 'news'

const FILTER_LABELS: Record<FilterKey, string> = {
  services: 'Services',
  'case-studies': 'Stories',
  news: 'News',
}

const FILTER_ORDER: FilterKey[] = ['services', 'case-studies', 'news']

export function SearchUI() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<PagefindResult[]>([])
  const [activeFilter, setActiveFilter] = useState<FilterKey | null>(null)
  const [loading, setLoading] = useState(false)
  const [ready, setReady] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Focus the search input on mount — page is explicitly about search.
    inputRef.current?.focus()

    // Load Pagefind dynamically — only available in production builds
    const loadPagefind = async () => {
      try {
        // @ts-expect-error pagefind runtime module — resolved at runtime from /public
        const mod = await import(/* webpackIgnore: true */ '/pagefind/pagefind.js')
        window.pagefind = mod as PagefindAPI
        setReady(true)
      } catch {
        setReady(false)
      }
    }
    loadPagefind()
  }, [])

  useEffect(() => {
    const trimmed = query.trim()
    if (!trimmed || !window.pagefind) {
      // Clear stale results asynchronously to avoid cascading renders.
      const clearHandle = setTimeout(() => setResults([]), 0)
      return () => clearTimeout(clearHandle)
    }
    const handle = setTimeout(async () => {
      setLoading(true)
      try {
        const search = await window.pagefind!.search(trimmed)
        const data = await Promise.all(search.results.slice(0, 10).map((r) => r.data()))
        setResults(data)
      } finally {
        setLoading(false)
      }
    }, 200)
    return () => clearTimeout(handle)
  }, [query])

  const filtered = activeFilter
    ? results.filter((r) => r.url.includes(`/${activeFilter}/`))
    : results

  const counts: Record<FilterKey, number> = {
    services: results.filter((r) => r.url.includes('/services/')).length,
    'case-studies': results.filter((r) => r.url.includes('/case-studies/')).length,
    news: results.filter((r) => r.url.includes('/news/')).length,
  }

  return (
    <div className="flex flex-col gap-6">
      <label className="flex flex-col gap-2">
        <span className="sr-only">Search</span>
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search the site…"
          className="w-full border-4 border-cc-black px-4 py-3 text-lg bg-cc-white focus:outline-none focus:border-cc-magenta"
        />
      </label>

      {!ready && (
        <p className="text-sm text-cc-fg-muted">
          Search index loads in production. In dev, search results don&apos;t appear until you run{' '}
          <code>npm run build &amp;&amp; npm run start</code>.
        </p>
      )}

      {loading && <p className="text-sm text-cc-fg-muted">Searching…</p>}

      {results.length > 0 && (
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by type">
          <button
            type="button"
            aria-pressed={activeFilter === null}
            onClick={() => setActiveFilter(null)}
            className={`px-3 py-1 border-2 border-cc-black text-sm font-semibold ${activeFilter === null ? 'bg-cc-magenta text-white' : 'bg-white text-cc-black hover:bg-cc-surface-pink'}`}
          >
            All ({results.length})
          </button>
          {FILTER_ORDER.map((k) => {
            const count = counts[k]
            if (count === 0) return null
            return (
              <button
                key={k}
                type="button"
                aria-pressed={activeFilter === k}
                onClick={() => setActiveFilter(k)}
                className={`px-3 py-1 border-2 border-cc-black text-sm font-semibold ${activeFilter === k ? 'bg-cc-magenta text-white' : 'bg-white text-cc-black hover:bg-cc-surface-pink'}`}
              >
                {FILTER_LABELS[k]} ({count})
              </button>
            )
          })}
        </div>
      )}

      {filtered.length > 0 && (
        <ul className="flex flex-col gap-4">
          {filtered.map((r) => (
            <li key={r.url}>
              <a href={r.url} className="block group no-underline">
                <Module
                  weight="card"
                  className="p-4 transition-transform duration-[0.18s] ease-out group-hover:-translate-x-[2px] group-hover:-translate-y-[2px] group-hover:shadow-hard-card motion-reduce:transition-none"
                >
                  <h2 className="text-xl font-bold leading-tight">{r.meta.title}</h2>
                  <p
                    className="text-sm text-cc-fg-muted mt-1"
                    dangerouslySetInnerHTML={{ __html: r.excerpt }}
                  />
                  <p className="text-xs text-cc-fg-muted mt-1">{r.url}</p>
                </Module>
              </a>
            </li>
          ))}
        </ul>
      )}

      {ready && query && !loading && filtered.length === 0 && results.length > 0 && (
        <p className="text-base text-cc-fg-muted">
          No {activeFilter ? FILTER_LABELS[activeFilter] : ''} results for &ldquo;{query}&rdquo;.
        </p>
      )}

      {ready && query && !loading && results.length === 0 && (
        <p className="text-base text-cc-fg-muted">No results for &ldquo;{query}&rdquo;.</p>
      )}
    </div>
  )
}

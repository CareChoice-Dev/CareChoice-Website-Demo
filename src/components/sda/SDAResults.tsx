'use client'

import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import type { SDAVacancy } from './types'
import { SDAFilters, type SDAFilterState } from './SDAFilters'
import { SDAGridMapToggle } from './SDAGridMapToggle'

/**
 * Client wrapper that makes the find-a-home listing actually filter — the
 * SDAFilters control bar was previously defined but never wired in, so the
 * "Help me find a home" wizard and any deep-link were cosmetic.
 *
 * Initial filter state is read from the URL (region / design / available /
 * accessibility), so deep-links from the homepage hero finder and the wizard
 * land pre-filtered. Subsequent in-page navigations re-sync via searchParams;
 * manual changes to the control bar update local state without touching the URL.
 */
export function SDAResults({
  vacancies,
  hrefPrefix,
}: {
  vacancies: SDAVacancy[]
  hrefPrefix: string
}) {
  const searchParams = useSearchParams()
  const spString = searchParams.toString()

  const fromUrl = useMemo<SDAFilterState>(
    () => ({
      region: searchParams.get('region') ?? '',
      designStandard: searchParams.get('design') ?? '',
      availableOnly: searchParams.get('available') === '1',
      accessibility: (searchParams.get('accessibility') ?? '').split(',').filter(Boolean),
    }),
    // spString captures every param change; searchParams identity is stable per nav.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [spString],
  )

  const [filters, setFilters] = useState<SDAFilterState>(fromUrl)

  // Re-sync when a deep-link / wizard navigation changes the URL.
  useEffect(() => {
    setFilters(fromUrl)
  }, [fromUrl])

  const filtered = useMemo(
    () =>
      vacancies.filter((v) => {
        if (filters.region && v.region !== filters.region) return false
        if (filters.designStandard && v.designStandard !== filters.designStandard) return false
        if (filters.availableOnly && !((v.availableBeds ?? 0) > 0)) return false
        if (filters.accessibility.length > 0) {
          const tags = v.accessibility ?? []
          if (!filters.accessibility.some((a) => tags.includes(a))) return false
        }
        return true
      }),
    [vacancies, filters],
  )

  return (
    <div className="flex flex-col gap-3">
      <SDAFilters vacancies={vacancies} value={filters} onChange={setFilters} />
      <p className="text-sm text-cc-fg-muted" aria-live="polite">
        Showing <span className="font-semibold text-cc-black">{filtered.length}</span> of{' '}
        {vacancies.length} homes
        {filters.availableOnly || filters.region || filters.designStandard ? ' matching your filters' : ''}.
      </p>
      {filtered.length === 0 ? (
        <div className="border-2 border-cc-black bg-cc-surface-pink p-6">
          <p className="font-semibold mb-1">No homes match those filters right now.</p>
          <p className="text-sm">
            Try removing a filter, or{' '}
            <a href={`${hrefPrefix}/enquiry`} className="underline font-semibold">
              tell us what you need
            </a>{' '}
            and we&apos;ll help you find a fit.
          </p>
        </div>
      ) : (
        <SDAGridMapToggle vacancies={filtered} hrefPrefix={hrefPrefix} />
      )}
    </div>
  )
}

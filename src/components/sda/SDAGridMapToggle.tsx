'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import type { SDAVacancy } from './types'
import { SDAGrid } from './SDAGrid'

// Leaflet pulls in window globals; only render on the client.
const SDAMap = dynamic(() => import('./SDAMap').then((m) => m.SDAMap), { ssr: false })

interface Props {
  vacancies: SDAVacancy[]
  hrefPrefix: string
}

export function SDAGridMapToggle({ vacancies, hrefPrefix }: Props) {
  const [view, setView] = useState<'grid' | 'map'>('grid')
  const mappable = vacancies.filter(
    (v): v is SDAVacancy & { geo: { lat: number; lng: number } } => v.geo !== null,
  )

  return (
    <div className="flex flex-col gap-4">
      <div role="group" aria-label="View" className="flex gap-0 self-start">
        <button
          type="button"
          aria-pressed={view === 'grid'}
          onClick={() => setView('grid')}
          className={`px-4 py-2 border-2 border-cc-black font-semibold ${
            view === 'grid'
              ? 'bg-cc-magenta text-white'
              : 'bg-white text-cc-black hover:bg-cc-surface-pink'
          }`}
        >
          Grid
        </button>
        <button
          type="button"
          aria-pressed={view === 'map'}
          onClick={() => setView('map')}
          className={`px-4 py-2 border-2 border-cc-black -ml-[2px] font-semibold ${
            view === 'map'
              ? 'bg-cc-magenta text-white'
              : 'bg-white text-cc-black hover:bg-cc-surface-pink'
          }`}
        >
          Map
        </button>
      </div>

      {view === 'grid' ? (
        <SDAGrid vacancies={vacancies} hrefPrefix={hrefPrefix} />
      ) : mappable.length === 0 ? (
        <p className="text-base text-cc-fg-muted">
          No homes have map coordinates yet. Try the grid view, or come back once geocoding has finished.
        </p>
      ) : (
        <SDAMap points={mappable} hrefPrefix={hrefPrefix} />
      )}
    </div>
  )
}

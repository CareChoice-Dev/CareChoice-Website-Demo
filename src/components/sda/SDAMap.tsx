'use client'

import 'leaflet/dist/leaflet.css'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import { useMemo } from 'react'
import L from 'leaflet'
import type { SDAVacancy } from './types'

// Custom magenta marker as a data-URI SVG (avoids Leaflet's default-marker image path issues under Turbopack).
const defaultIcon = L.icon({
  iconUrl:
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzMCA0NCI+PHBhdGggZmlsbD0iI0ZGMDA4QyIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utd2lkdGg9IjIiIGQ9Ik0xNSAxQzggMSAyIDcgMiAxNGMwIDEwIDEzIDI4IDEzIDI4UzI4IDI0IDI4IDE0YzAtNy02LTEzLTEzLTEzeiIvPjxjaXJjbGUgY3g9IjE1IiBjeT0iMTQiIHI9IjUiIGZpbGw9IiNmZmYiLz48L3N2Zz4=',
  iconSize: [30, 44],
  iconAnchor: [15, 44],
  popupAnchor: [0, -38],
})

export interface SDAMapPoint extends SDAVacancy {
  geo: { lat: number; lng: number }
}

export function SDAMap({
  points,
  hrefPrefix,
}: {
  points: SDAMapPoint[]
  hrefPrefix: string
}) {
  const center = useMemo<[number, number]>(() => {
    if (points.length === 0) return [-37.8136, 144.9631] // Melbourne CBD default
    const lat = points.reduce((s, p) => s + p.geo.lat, 0) / points.length
    const lng = points.reduce((s, p) => s + p.geo.lng, 0) / points.length
    return [lat, lng]
  }, [points])

  return (
    <div
      className="h-[560px] border-[7px] border-cc-black"
      role="region"
      aria-label="Map of available CareChoice homes. Use the plus and minus buttons to zoom and arrow keys to pan; the list view above shows the same homes without a map."
    >
      {/* zoomControl (the +/- buttons) and keyboard (arrow-key pan) are Leaflet
          defaults — they provide the single-pointer / no-drag alternatives
          required by WCAG 2.2 SC 2.5.7. The grid/map toggle is a further
          non-map path to the same listings. */}
      <MapContainer
        center={center}
        zoom={9}
        scrollWheelZoom
        zoomControl
        keyboard
        className="h-full w-full"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        {points.map((p) => (
          <Marker key={p.id} position={[p.geo.lat, p.geo.lng]} icon={defaultIcon}>
            <Popup>
              <div className="flex flex-col gap-1 text-sm">
                <strong className="text-base">{p.name}</strong>
                {p.address.formatted && <span>{p.address.formatted}</span>}
                <span className="font-semibold">
                  {p.availableBeds > 0
                    ? `${p.availableBeds} available`
                    : 'Currently full'}
                </span>
                <a
                  href={`${hrefPrefix}/find-a-home/${p.id}`}
                  className="underline mt-1"
                >
                  View this home ▸
                </a>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}

/**
 * Lightweight Nominatim geocoder with in-memory cache.
 *
 * On disk we keep `data/geocode-cache.json` as a seed/warm cache, but for
 * server-side runs we read it once and operate from memory. Writes to disk
 * are skipped in test env to keep tests hermetic.
 */

import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join } from 'path'

interface LatLng {
  lat: number
  lng: number
}

const CACHE_FILE = join(process.cwd(), 'data', 'geocode-cache.json')
const cache = new Map<string, LatLng | null>()
let warmed = false

function warmCacheFromDisk(): void {
  if (warmed) return
  warmed = true
  if (process.env.NODE_ENV === 'test') return
  if (!existsSync(CACHE_FILE)) return
  try {
    const raw = readFileSync(CACHE_FILE, 'utf-8')
    const data = JSON.parse(raw) as Record<string, LatLng | null>
    for (const [k, v] of Object.entries(data)) cache.set(k, v)
  } catch {
    // ignore — cache is non-essential
  }
}

function persistCache(): void {
  if (process.env.NODE_ENV === 'test') return
  try {
    const obj: Record<string, LatLng | null> = {}
    for (const [k, v] of cache.entries()) obj[k] = v
    writeFileSync(CACHE_FILE, JSON.stringify(obj, null, 2))
  } catch {
    // ignore
  }
}

/** Reset for tests only — not part of the public API. */
export function _resetForTests(): void {
  cache.clear()
  warmed = false
}

export async function geocodeAddress(query: string): Promise<LatLng | null> {
  if (!query || query.trim().length === 0) return null
  warmCacheFromDisk()

  const key = query.trim().toLowerCase()
  if (cache.has(key)) return cache.get(key) ?? null

  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(query)}`
    const res = await fetch(url, {
      headers: { 'User-Agent': 'carechoice-demo (geocode lookup)' },
    })
    if (!res.ok) {
      cache.set(key, null)
      return null
    }
    const data = (await res.json()) as Array<{ lat: string; lon: string }>
    if (!data.length) {
      cache.set(key, null)
      persistCache()
      return null
    }
    const result: LatLng = { lat: Number(data[0].lat), lng: Number(data[0].lon) }
    cache.set(key, result)
    persistCache()
    return result
  } catch {
    return null
  }
}

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { geocodeAddress, _resetForTests } from '@/lib/geocode'

describe('geocodeAddress', () => {
  beforeEach(() => {
    _resetForTests()
    vi.restoreAllMocks()
  })

  it('returns null for empty input', async () => {
    expect(await geocodeAddress('')).toBeNull()
  })

  it('hits Nominatim and returns lat/lng', async () => {
    const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValue(
      new Response(JSON.stringify([{ lat: '-37.8', lon: '144.9' }]), { status: 200 }),
    )
    const result = await geocodeAddress('28 Eaton Road Mount Duneed VIC 3216')
    expect(result).toEqual({ lat: -37.8, lng: 144.9 })
    expect(fetchSpy).toHaveBeenCalledOnce()
    const [url] = fetchSpy.mock.calls[0]
    expect(url).toContain('nominatim.openstreetmap.org')
  })

  it('caches subsequent calls for the same query', async () => {
    const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValue(
      new Response(JSON.stringify([{ lat: '1', lon: '2' }]), { status: 200 }),
    )
    await geocodeAddress('Cached address')
    await geocodeAddress('Cached address')
    expect(fetchSpy).toHaveBeenCalledOnce()
  })

  it('returns null when Nominatim returns no results', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue(new Response('[]', { status: 200 }))
    const result = await geocodeAddress('Definitely not a place 999999')
    expect(result).toBeNull()
  })

  it('returns null on Nominatim error (does not throw)', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue(new Response('boom', { status: 500 }))
    expect(await geocodeAddress('Anywhere')).toBeNull()
  })
})

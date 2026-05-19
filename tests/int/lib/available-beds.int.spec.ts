import { describe, it, expect } from 'vitest'
import { calculateAvailableBeds } from '@/lib/available-beds'

describe('calculateAvailableBeds', () => {
  it('returns the difference between active and occupied', () => {
    expect(calculateAvailableBeds(3, 1)).toBe(2)
  })

  it('returns 0 when fully occupied', () => {
    expect(calculateAvailableBeds(3, 3)).toBe(0)
  })

  it('returns the total when nothing is occupied', () => {
    expect(calculateAvailableBeds(4, 0)).toBe(4)
  })

  it('returns 0 (never negative) when occupied exceeds active', () => {
    expect(calculateAvailableBeds(2, 5)).toBe(0)
  })

  it('returns 0 when active is null/undefined', () => {
    expect(calculateAvailableBeds(null, 1)).toBe(0)
    expect(calculateAvailableBeds(undefined, 1)).toBe(0)
  })

  it('returns active when occupied is null/undefined', () => {
    expect(calculateAvailableBeds(3, null)).toBe(3)
    expect(calculateAvailableBeds(3, undefined)).toBe(3)
  })

  it('returns 0 when both are null', () => {
    expect(calculateAvailableBeds(null, null)).toBe(0)
  })
})

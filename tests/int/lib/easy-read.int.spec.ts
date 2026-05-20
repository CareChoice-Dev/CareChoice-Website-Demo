import { describe, it, expect } from 'vitest'
import { swapLocaleInPath, isEasyReadPath } from '@/lib/easy-read'

describe('easy-read URL helpers', () => {
  it('swapLocaleInPath replaces the first segment', () => {
    expect(swapLocaleInPath('/en/services/sil', 'easy-read')).toBe('/easy-read/services/sil')
    expect(swapLocaleInPath('/easy-read/find-a-home', 'en')).toBe('/en/find-a-home')
    expect(swapLocaleInPath('/vi/about', 'easy-read')).toBe('/easy-read/about')
  })

  it('swapLocaleInPath handles bare locale path', () => {
    expect(swapLocaleInPath('/en', 'easy-read')).toBe('/easy-read')
  })

  it('swapLocaleInPath defaults to /en if path has no locale', () => {
    expect(swapLocaleInPath('/', 'easy-read')).toBe('/easy-read')
  })

  it('isEasyReadPath checks first segment', () => {
    expect(isEasyReadPath('/easy-read/foo')).toBe(true)
    expect(isEasyReadPath('/easy-read')).toBe(true)
    expect(isEasyReadPath('/en/foo')).toBe(false)
    expect(isEasyReadPath('/')).toBe(false)
  })
})

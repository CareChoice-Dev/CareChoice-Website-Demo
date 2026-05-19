import { describe, it, expect } from 'vitest'
import { detectLocale } from '@/middleware-helpers'

describe('detectLocale', () => {
  it('returns en for / path', () => {
    expect(detectLocale('/')).toBe('en')
  })

  it('returns vi for /vi/services', () => {
    expect(detectLocale('/vi/services')).toBe('vi')
  })

  it('returns zh for /zh/anything', () => {
    expect(detectLocale('/zh/anything')).toBe('zh')
  })

  it('returns en-easy-read for /easy-read/services', () => {
    expect(detectLocale('/easy-read/services')).toBe('en-easy-read')
  })

  it('returns en for unrecognised prefixes', () => {
    expect(detectLocale('/fr/anything')).toBe('en')
  })
})

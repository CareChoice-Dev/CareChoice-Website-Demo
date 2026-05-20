import { describe, it, expect } from 'vitest'
import {
  urlSlugToLocale,
  payloadLocaleToUrlSlug,
  htmlLangFor,
  isUrlSlug,
  URL_LOCALE_SLUGS,
  PAYLOAD_LOCALES,
} from '@/lib/locale'

describe('locale mapping', () => {
  it('exposes the 4 URL slugs and the 4 payload locales', () => {
    expect(URL_LOCALE_SLUGS).toEqual(['en', 'vi', 'zh', 'easy-read'])
    expect(PAYLOAD_LOCALES).toEqual(['en', 'vi', 'zh', 'en-easy-read'])
  })

  it('maps URL slug to payload locale', () => {
    expect(urlSlugToLocale('en')).toBe('en')
    expect(urlSlugToLocale('vi')).toBe('vi')
    expect(urlSlugToLocale('zh')).toBe('zh')
    expect(urlSlugToLocale('easy-read')).toBe('en-easy-read')
  })

  it('maps payload locale to URL slug', () => {
    expect(payloadLocaleToUrlSlug('en')).toBe('en')
    expect(payloadLocaleToUrlSlug('vi')).toBe('vi')
    expect(payloadLocaleToUrlSlug('zh')).toBe('zh')
    expect(payloadLocaleToUrlSlug('en-easy-read')).toBe('easy-read')
  })

  it('returns html lang attribute per locale', () => {
    expect(htmlLangFor('en')).toBe('en')
    expect(htmlLangFor('vi')).toBe('vi')
    expect(htmlLangFor('zh')).toBe('zh-Hans')
    expect(htmlLangFor('en-easy-read')).toBe('en')
  })

  it('isUrlSlug guards against unknown strings', () => {
    expect(isUrlSlug('en')).toBe(true)
    expect(isUrlSlug('easy-read')).toBe(true)
    expect(isUrlSlug('fr')).toBe(false)
    expect(isUrlSlug('')).toBe(false)
  })
})

export const URL_LOCALE_SLUGS = ['en', 'vi', 'zh', 'easy-read'] as const
export type UrlLocaleSlug = (typeof URL_LOCALE_SLUGS)[number]

export const PAYLOAD_LOCALES = ['en', 'vi', 'zh', 'en-easy-read'] as const
export type PayloadLocale = (typeof PAYLOAD_LOCALES)[number]

const URL_TO_PAYLOAD: Record<UrlLocaleSlug, PayloadLocale> = {
  en: 'en',
  vi: 'vi',
  zh: 'zh',
  'easy-read': 'en-easy-read',
}

const PAYLOAD_TO_URL: Record<PayloadLocale, UrlLocaleSlug> = {
  en: 'en',
  vi: 'vi',
  zh: 'zh',
  'en-easy-read': 'easy-read',
}

const HTML_LANG: Record<PayloadLocale, string> = {
  en: 'en',
  vi: 'vi',
  zh: 'zh-Hans',
  'en-easy-read': 'en',
}

export function isUrlSlug(value: string): value is UrlLocaleSlug {
  return (URL_LOCALE_SLUGS as readonly string[]).includes(value)
}

export function urlSlugToLocale(slug: UrlLocaleSlug): PayloadLocale {
  return URL_TO_PAYLOAD[slug]
}

export function payloadLocaleToUrlSlug(locale: PayloadLocale): UrlLocaleSlug {
  return PAYLOAD_TO_URL[locale]
}

export function htmlLangFor(locale: PayloadLocale): string {
  return HTML_LANG[locale]
}

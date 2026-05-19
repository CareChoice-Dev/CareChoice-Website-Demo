export const SUPPORTED_LOCALES = ['en', 'en-easy-read', 'vi', 'zh'] as const
export type Locale = (typeof SUPPORTED_LOCALES)[number]

const PREFIX_TO_LOCALE: Record<string, Locale> = {
  vi: 'vi',
  zh: 'zh',
  'easy-read': 'en-easy-read',
}

export function detectLocale(pathname: string): Locale {
  const first = pathname.split('/').filter(Boolean)[0]
  if (!first) return 'en'
  return PREFIX_TO_LOCALE[first] ?? 'en'
}

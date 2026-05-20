import { isUrlSlug, type UrlLocaleSlug } from './locale'

export function swapLocaleInPath(path: string, target: UrlLocaleSlug): string {
  const segments = path.split('/').filter(Boolean)
  if (segments.length === 0 || !isUrlSlug(segments[0])) {
    return `/${target}${path === '/' ? '' : path}`
  }
  segments[0] = target
  return '/' + segments.join('/')
}

export function isEasyReadPath(path: string): boolean {
  const first = path.split('/').filter(Boolean)[0]
  return first === 'easy-read'
}

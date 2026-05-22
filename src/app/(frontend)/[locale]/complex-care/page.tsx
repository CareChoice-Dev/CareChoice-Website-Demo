import { permanentRedirect } from 'next/navigation'
import { isUrlSlug } from '@/lib/locale'

/**
 * 308 permanent redirect: /complex-care → /services/complex-care.
 *
 * Moved under /services in Plan 6 (Task 4) so all service detail pages live
 * under a single hub. Old URL kept as a redirect for any incidental bookmarks.
 */
export default async function ComplexCareRedirect({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const prefix = isUrlSlug(locale) ? `/${locale}` : '/en'
  permanentRedirect(`${prefix}/services/complex-care`)
}

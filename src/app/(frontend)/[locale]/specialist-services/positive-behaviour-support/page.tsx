import { permanentRedirect } from 'next/navigation'
import { isUrlSlug } from '@/lib/locale'

/**
 * 308 permanent redirect: /specialist-services/positive-behaviour-support →
 * /services/positive-behaviour-support.
 *
 * Moved under /services in Plan 6 (Task 5) so all service detail pages live
 * under a single hub. Old URL kept as a redirect for any incidental bookmarks.
 */
export default async function PbsRedirect({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const prefix = isUrlSlug(locale) ? `/${locale}` : '/en'
  permanentRedirect(`${prefix}/services/positive-behaviour-support`)
}

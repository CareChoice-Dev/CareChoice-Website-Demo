import { getPayload } from 'payload'
import config from '@payload-config'

/**
 * Site-wide Organization structured data (schema.org JSON-LD).
 *
 * Mounted once in the locale layout so it appears on every page. Pulls
 * name / phone / email / NDIS provider number from the SiteSettings global so
 * the marketing team can keep it current via /admin without a code change.
 *
 * Improves how search engines understand CareChoice as an entity and is the
 * foundation for richer per-page schema (Service, Place) added elsewhere.
 */

const SITE_URL = 'https://care-choice-website-demo.vercel.app'

export async function OrganizationJsonLd() {
  let phone = '1300 737 942'
  let email = 'enquiries@carechoice.com.au'
  let ndisProviderNumber: string | undefined

  try {
    const payload = await getPayload({ config })
    const settings = await payload.findGlobal({ slug: 'site-settings' })
    phone = (settings?.phoneNumber as string | undefined)?.trim() || phone
    email = (settings?.contactEmail as string | undefined)?.trim() || email
    ndisProviderNumber = (settings?.ndisProviderNumber as string | undefined)?.trim() || undefined
  } catch {
    // Fall back to defaults if Payload is unavailable at render time.
  }

  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'CareChoice',
    description:
      'Australian NDIS-registered disability service provider delivering Supported Independent Living (SIL), Specialist Disability Accommodation (SDA) and community support.',
    url: SITE_URL,
    telephone: phone,
    email,
    areaServed: 'AU',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: phone,
      email,
      contactType: 'customer service',
      areaServed: 'AU',
      availableLanguage: ['English', 'Vietnamese', 'Chinese'],
    },
  }

  if (ndisProviderNumber) {
    // Surface the NDIS provider registration as a verifiable identifier.
    data.identifier = {
      '@type': 'PropertyValue',
      propertyID: 'NDIS Provider Registration Number',
      value: ndisProviderNumber,
    }
  }

  return (
    <script
      type="application/ld+json"
      // JSON-LD is trusted, server-generated content (no user input) — safe to inline.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

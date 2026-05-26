import type { SDAVacancy } from '@/components/sda/types'

/**
 * Per-home structured data (schema.org JSON-LD) for an SDA listing.
 *
 * Uses `Accommodation` (a Place subtype) with PostalAddress + GeoCoordinates so
 * the home is eligible for Google local/map results on searches like
 * "SDA Geelong". Accessibility features and amenities are emitted as
 * `amenityFeature` (LocationFeatureSpecification), and the home is linked to the
 * CareChoice provider Organization.
 */

const SITE_URL = 'https://care-choice-website-demo.vercel.app'

export function SDAHomeJsonLd({ home, urlPrefix }: { home: SDAVacancy; urlPrefix: string }) {
  const features = [...home.accessibility, ...home.amenities].map((name) => ({
    '@type': 'LocationFeatureSpecification',
    name,
    value: true,
  }))

  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Accommodation',
    name: home.name,
    url: `${SITE_URL}${urlPrefix}/find-a-home/${home.id}`,
    provider: {
      '@type': 'Organization',
      name: 'CareChoice',
      url: SITE_URL,
    },
  }

  if (home.description) data.description = home.description
  if (home.designStandard) {
    data.additionalProperty = {
      '@type': 'PropertyValue',
      name: 'SDA Design Standard',
      value: home.designStandard,
    }
  }

  // PostalAddress — only include sub-fields that are populated.
  const address: Record<string, string> = { '@type': 'PostalAddress', addressCountry: 'AU' }
  if (home.address.line1) address.streetAddress = home.address.line1
  if (home.address.suburb) address.addressLocality = home.address.suburb
  if (home.address.state) address.addressRegion = home.address.state
  if (home.address.postcode) address.postalCode = home.address.postcode
  if (Object.keys(address).length > 2) data.address = address

  if (home.geo) {
    data.geo = {
      '@type': 'GeoCoordinates',
      latitude: home.geo.lat,
      longitude: home.geo.lng,
    }
  }

  if (features.length > 0) data.amenityFeature = features

  const heroPhotos = home.photos.filter((p) => p.url).map((p) => p.url)
  if (heroPhotos.length > 0) data.photo = heroPhotos

  // numberOfBedrooms / occupancy where we have it.
  if (home.activeBeds > 0) {
    data.numberOfBedrooms = home.activeBeds
    data.occupancy = {
      '@type': 'QuantitativeValue',
      value: home.availableBeds,
      unitText: 'available beds',
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

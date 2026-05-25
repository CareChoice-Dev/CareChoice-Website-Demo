import type { AdminViewServerProps } from 'payload'
import { DefaultTemplate } from '@payloadcms/next/templates'
import { headers as nextHeaders } from 'next/headers'
import Link from 'next/link'
import { getPayloadClient } from '@/lib/payload-client'
import type { Media, SdaPhoto } from '@/payload-types'

/**
 * Custom List view for the `sda-photos` collection.
 *
 * The default Payload list shows individual photo upload rows, which is
 * confusing for marketing — they think in terms of sites, not photos.
 *
 * This view flips the model: render every active SDA site from Salesforce
 * as a card, with its photo count and a quick "Add photo" action. The flat
 * list view is reachable via Payload's normal filters (e.g.
 * `?where[siteId][equals]=<id>` from the per-site link).
 */

interface SDAVacancyAddress {
  formatted: string
}

interface SDAVacancyLite {
  id: string
  name: string
  address?: SDAVacancyAddress
}

interface SiteEntry {
  site: SDAVacancyLite
  count: number
  hero: Media | null
}

async function fetchSites(): Promise<SDAVacancyLite[]> {
  try {
    const h = await nextHeaders()
    const proto = h.get('x-forwarded-proto') ?? 'http'
    const host = h.get('host') ?? 'localhost:3000'
    const res = await fetch(`${proto}://${host}/api/sda-vacancies`, {
      next: { revalidate: 600 },
    })
    if (!res.ok) return []
    const data = (await res.json()) as { vacancies: SDAVacancyLite[] }
    return data.vacancies ?? []
  } catch (err) {
    console.error('[SDASitesView] failed to load SDA vacancies', err)
    return []
  }
}

async function fetchPhotos(): Promise<SdaPhoto[]> {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'sda-photos',
    pagination: false,
    limit: 0,
    depth: 1,
    sort: 'displayOrder',
  })
  return result.docs as SdaPhoto[]
}

function buildSiteEntries(
  sites: SDAVacancyLite[],
  photos: SdaPhoto[],
): SiteEntry[] {
  // group photos by siteId
  const grouped = new Map<string, SdaPhoto[]>()
  for (const p of photos) {
    const arr = grouped.get(p.siteId) ?? []
    arr.push(p)
    grouped.set(p.siteId, arr)
  }

  return sites
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((site) => {
      const photosForSite = grouped.get(site.id) ?? []
      // hero preference: first explicit hero, else lowest displayOrder (already sorted)
      const heroPhoto =
        photosForSite.find((p) => p.isHero) ?? photosForSite[0] ?? null
      const heroMedia =
        heroPhoto && typeof heroPhoto.media === 'object' ? heroPhoto.media : null
      return {
        site,
        count: photosForSite.length,
        hero: heroMedia,
      }
    })
}

// ---------- Inline styles (admin palette — restrained, not CareChoice magenta) ----------

const styles = {
  wrapper: {
    padding: '1.5rem 2rem',
  } satisfies React.CSSProperties,

  headerRow: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    gap: '1rem',
    marginBottom: '1.5rem',
  } satisfies React.CSSProperties,

  title: {
    fontSize: '1.5rem',
    fontWeight: 600,
    margin: 0,
  } satisfies React.CSSProperties,

  subtitle: {
    fontSize: 13,
    color: '#777',
    margin: '0.25rem 0 0 0',
  } satisfies React.CSSProperties,

  flatLink: {
    fontSize: 13,
    color: '#555',
    textDecoration: 'underline',
  } satisfies React.CSSProperties,

  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '1rem',
  } satisfies React.CSSProperties,

  card: {
    border: '1px solid #e4e4e4',
    borderRadius: 6,
    padding: '1rem',
    background: '#fff',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.75rem',
  } satisfies React.CSSProperties,

  cardTop: {
    display: 'flex',
    gap: '0.75rem',
    alignItems: 'flex-start',
  } satisfies React.CSSProperties,

  thumb: {
    width: 80,
    height: 80,
    objectFit: 'cover' as const,
    borderRadius: 4,
    background: '#f4f4f4',
    flexShrink: 0,
  } satisfies React.CSSProperties,

  thumbPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 4,
    background: '#f4f4f4',
    color: '#999',
    fontSize: 11,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  } satisfies React.CSSProperties,

  siteName: {
    fontSize: 14,
    fontWeight: 600,
    color: '#222',
    margin: 0,
    lineHeight: 1.3,
  } satisfies React.CSSProperties,

  address: {
    fontSize: 12,
    color: '#777',
    margin: '0.25rem 0 0 0',
    lineHeight: 1.3,
  } satisfies React.CSSProperties,

  badgeNeutral: {
    display: 'inline-block',
    padding: '2px 8px',
    background: '#f0f0f0',
    color: '#333',
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 500,
  } satisfies React.CSSProperties,

  badgeWarning: {
    display: 'inline-block',
    padding: '2px 8px',
    background: '#fff4e0',
    color: '#a35200',
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 500,
  } satisfies React.CSSProperties,

  actionsRow: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '0.5rem',
    alignItems: 'center',
    marginTop: 'auto',
  } satisfies React.CSSProperties,

  primaryBtn: {
    display: 'inline-block',
    padding: '6px 12px',
    background: '#222',
    color: '#fff',
    borderRadius: 4,
    fontSize: 13,
    textDecoration: 'none',
    fontWeight: 500,
  } satisfies React.CSSProperties,

  secondaryLink: {
    fontSize: 13,
    color: '#0050b3',
    textDecoration: 'underline',
  } satisfies React.CSSProperties,

  empty: {
    padding: '2rem',
    textAlign: 'center' as const,
    color: '#777',
    fontSize: 14,
  } satisfies React.CSSProperties,
}

function CountBadge({ count }: { count: number }) {
  if (count === 0) {
    return <span style={styles.badgeWarning}>0 photos — needs photos</span>
  }
  return (
    <span style={styles.badgeNeutral}>
      {count} {count === 1 ? 'photo' : 'photos'}
    </span>
  )
}

function SiteCard({ entry }: { entry: SiteEntry }) {
  const { site, count, hero } = entry
  const heroUrl = hero?.url ?? null
  const heroAlt = hero?.alt ?? site.name
  const addressText = site.address?.formatted?.trim()

  // Payload's list view honors `where` query params for filtering.
  const filterUrl = `/admin/collections/sda-photos?where[siteId][equals]=${encodeURIComponent(
    site.id,
  )}`

  return (
    <div style={styles.card}>
      <div style={styles.cardTop}>
        {heroUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={heroUrl} alt={heroAlt} style={styles.thumb} />
        ) : (
          <div style={styles.thumbPlaceholder}>No photo</div>
        )}
        <div style={{ minWidth: 0, flex: 1 }}>
          <p style={styles.siteName}>{site.name}</p>
          {addressText && <p style={styles.address}>{addressText}</p>}
          <div style={{ marginTop: '0.5rem' }}>
            <CountBadge count={count} />
          </div>
        </div>
      </div>
      <div style={styles.actionsRow}>
        <Link
          href="/admin/collections/sda-photos/create"
          style={styles.primaryBtn}
        >
          Add photo
        </Link>
        {count > 0 && (
          <Link href={filterUrl} style={styles.secondaryLink}>
            View {count} {count === 1 ? 'photo' : 'photos'}
          </Link>
        )}
      </div>
    </div>
  )
}

export async function SDASitesView(props: AdminViewServerProps) {
  const [sites, photos] = await Promise.all([fetchSites(), fetchPhotos()])
  const entries = buildSiteEntries(sites, photos)

  // The standard create form will load with the Site picker available.
  const flatViewUrl =
    '/admin/collections/sda-photos?where[siteId][exists]=true'

  return (
    <DefaultTemplate
      collectionSlug="sda-photos"
      i18n={props.i18n}
      locale={props.locale}
      params={props.params}
      payload={props.payload}
      permissions={props.permissions}
      searchParams={props.searchParams}
      user={props.user}
      viewType="list"
      visibleEntities={
        props.initPageResult?.visibleEntities ?? {
          collections: [],
          globals: [],
        }
      }
    >
      <div style={styles.wrapper}>
        <div style={styles.headerRow}>
          <div>
            <h1 style={styles.title}>SDA Sites</h1>
            <p style={styles.subtitle}>
              Pick a site to add or manage photos.
            </p>
          </div>
          <Link href={flatViewUrl} style={styles.flatLink}>
            View all photos (flat list) →
          </Link>
        </div>

        {entries.length === 0 ? (
          <div style={styles.empty}>
            No active SDA sites found. Check the Salesforce connection at{' '}
            <code>/api/sda-vacancies</code>.
          </div>
        ) : (
          <div style={styles.grid}>
            {entries.map((entry) => (
              <SiteCard key={entry.site.id} entry={entry} />
            ))}
          </div>
        )}
      </div>
    </DefaultTemplate>
  )
}

export default SDASitesView

import { NextResponse } from 'next/server'
import { runQuery } from '@/lib/salesforce'
import { mapSiteRecord, type SiteRecord, type SDAPhotoRef } from './mapper'
import { getPayloadClient } from '@/lib/payload-client'
import fallback from '@/lib/sda-vacancies-fallback.json'

// Always fresh — Next.js's revalidate/tag caching wasn't busting
// reliably after admin SDAPhotos edits, leaving stale photo arrays
// for hours. The vacancies payload is <50 records of Salesforce SDA
// data, so always-fresh has negligible lambda perf cost for the demo.
export const dynamic = 'force-dynamic'

const SOQL = `
  SELECT Id, Name,
         enrtcr__Business_Address_1__c,
         enrtcr__Business_Address_2__c,
         enrtcr__Business_Suburb__c,
         enrtcr__Business_State__c,
         enrtcr__Business_Postcode__c,
         enrtcr__Business_Geolocation__Latitude__s,
         enrtcr__Business_Geolocation__Longitude__s,
         enrtcr__Site_Region__c,
         enrtcr__Site_Description__c,
         SDA_Design_Standards__c,
         Property_Type__c,
         enrtcr__Tenancy_Status__c,
         enrtcr__Amenities__c,
         Accessibility__c,
         Sharepoint_Direct_Link__c,
         enrtcr__Total_Active_Beds__c,
         enrtcr__Total_Beds_Occupied_Permanent__c
  FROM enrtcr__Site__c
  WHERE enrtcr__Inactive__c = false
    AND SDA_Approved__c = 'Yes'
    AND Future_or_Current_Build__c = 'Current'
    AND enrtcr__Total_Active_Beds__c > 0
  LIMIT 50
`
  .replace(/\s+/g, ' ')
  .trim()

async function fetchPhotosBySiteId(): Promise<Map<string, SDAPhotoRef[]>> {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'sda-photos',
    limit: 200,
    sort: 'displayOrder',
  })

  const grouped = new Map<string, SDAPhotoRef[]>()
  for (const doc of result.docs as Array<{
    siteId: string
    isHero?: boolean
    media: { url?: string; alt?: string } | string | number
  }>) {
    const media = typeof doc.media === 'object' ? doc.media : null
    if (!media?.url) continue
    const ref: SDAPhotoRef = {
      url: media.url,
      alt: media.alt ?? '',
      isHero: Boolean(doc.isHero),
    }
    const arr = grouped.get(doc.siteId) ?? []
    if (ref.isHero) arr.unshift(ref)
    else arr.push(ref)
    grouped.set(doc.siteId, arr)
  }
  return grouped
}

export async function GET() {
  try {
    const records = await runQuery<SiteRecord>(SOQL)
    const vacancies = records.map(mapSiteRecord)

    // Join Payload SDAPhotos in. If photo fetch fails, vacancies still ship with empty photo arrays.
    try {
      const photosBySite = await fetchPhotosBySiteId()
      for (const v of vacancies) {
        v.photos = photosBySite.get(v.id) ?? []
      }
    } catch (photoErr) {
      console.error('[sda-vacancies] photo join failed; continuing without photos', photoErr)
    }

    return NextResponse.json({
      vacancies,
      source: 'salesforce',
      fetchedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error('[sda-vacancies] Salesforce unreachable; using fallback:', error)
    return NextResponse.json({
      vacancies: fallback.vacancies,
      source: 'fallback',
      fetchedAt: new Date().toISOString(),
    })
  }
}

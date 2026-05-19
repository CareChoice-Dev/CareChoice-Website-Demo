import { NextResponse } from 'next/server'
import { runQuery } from '@/lib/salesforce'
import { mapSiteRecord, type SiteRecord } from './mapper'
import fallback from '@/lib/sda-vacancies-fallback.json'

export const revalidate = 600

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

export async function GET() {
  try {
    const records = await runQuery<SiteRecord>(SOQL)
    const vacancies = records.map(mapSiteRecord)
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

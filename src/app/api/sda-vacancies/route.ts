import { NextResponse } from 'next/server'
import { runQuery } from '@/lib/salesforce'
import { mapSiteRecord, type SiteRecord } from './mapper'
import fallback from '@/lib/sda-vacancies-fallback.json'

export const revalidate = 600

const SOQL = `
  SELECT Id, Name,
         enrtcr__Total_Active_Beds__c,
         enrtcr__Total_Beds_Occupied_Permanent__c
  FROM Site
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

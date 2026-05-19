import { calculateAvailableBeds } from '@/lib/available-beds'

/** Raw Salesforce Site record. Expand as schema discovery (Task 24) confirms more fields. */
export interface SiteRecord {
  Id: string
  Name: string
  enrtcr__Total_Active_Beds__c: number | null
  enrtcr__Total_Beds_Occupied_Permanent__c: number | null
  [key: string]: unknown
}

/** DTO returned to the frontend. */
export interface SDAVacancy {
  id: string
  name: string
  activeBeds: number
  occupiedBeds: number
  availableBeds: number
}

export function mapSiteRecord(record: SiteRecord): SDAVacancy {
  const active = record.enrtcr__Total_Active_Beds__c ?? 0
  const occupied = record.enrtcr__Total_Beds_Occupied_Permanent__c ?? 0
  return {
    id: record.Id,
    name: record.Name,
    activeBeds: active,
    occupiedBeds: occupied,
    availableBeds: calculateAvailableBeds(active, occupied),
  }
}

import { calculateAvailableBeds } from '@/lib/available-beds'

/**
 * Raw Salesforce Site record (`enrtcr__Site__c`).
 * See `docs/salesforce-schema.md` for full field reference.
 */
export interface SiteRecord {
  Id: string
  Name: string
  enrtcr__Total_Active_Beds__c?: number | null
  enrtcr__Total_Beds_Occupied_Permanent__c?: number | null
  enrtcr__Business_Address_1__c?: string | null
  enrtcr__Business_Address_2__c?: string | null
  enrtcr__Business_Suburb__c?: string | null
  enrtcr__Business_State__c?: string | null
  enrtcr__Business_Postcode__c?: string | null
  enrtcr__Business_Geolocation__Latitude__s?: number | null
  enrtcr__Business_Geolocation__Longitude__s?: number | null
  enrtcr__Site_Region__c?: string | null
  enrtcr__Site_Description__c?: string | null
  enrtcr__Amenities__c?: string | null
  enrtcr__Tenancy_Status__c?: string | null
  Accessibility__c?: string | null
  SDA_Design_Standards__c?: string | null
  Property_Type__c?: string | null
  Sharepoint_Direct_Link__c?: string | null
  [key: string]: unknown
}

export interface SDAPhotoRef {
  url: string
  alt: string
  isHero: boolean
}

export interface SDAVacancyAddress {
  line1: string | null
  line2: string | null
  suburb: string | null
  state: string | null
  postcode: string | null
  /** Single-line `"<line1>, <suburb> <state> <postcode>"` with empty bits dropped. Empty string when nothing populated. */
  formatted: string
}

/** DTO returned to the frontend. */
export interface SDAVacancy {
  id: string
  name: string
  activeBeds: number
  occupiedBeds: number
  availableBeds: number
  address: SDAVacancyAddress
  geo: { lat: number; lng: number } | null
  region: string | null
  description: string | null
  designStandard: string | null
  propertyType: string | null
  tenancyStatus: string | null
  amenities: string[]
  accessibility: string[]
  sharepointUrl: string | null
  photos: SDAPhotoRef[]
}

function splitMultipicklist(value: string | null | undefined): string[] {
  if (!value) return []
  return value.split(';').map((s) => s.trim()).filter(Boolean)
}

function buildAddress(record: SiteRecord): SDAVacancyAddress {
  const line1 = record.enrtcr__Business_Address_1__c ?? null
  const line2 = record.enrtcr__Business_Address_2__c ?? null
  const suburb = record.enrtcr__Business_Suburb__c ?? null
  const state = record.enrtcr__Business_State__c ?? null
  const postcode = record.enrtcr__Business_Postcode__c ?? null

  const localityBits = [suburb, state, postcode].filter(Boolean).join(' ')
  const formatted = [line1, localityBits].filter(Boolean).join(', ')

  return { line1, line2, suburb, state, postcode, formatted }
}

function buildGeo(record: SiteRecord): { lat: number; lng: number } | null {
  const lat = record.enrtcr__Business_Geolocation__Latitude__s
  const lng = record.enrtcr__Business_Geolocation__Longitude__s
  if (typeof lat !== 'number' || typeof lng !== 'number') return null
  return { lat, lng }
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
    address: buildAddress(record),
    geo: buildGeo(record),
    region: record.enrtcr__Site_Region__c ?? null,
    description: record.enrtcr__Site_Description__c ?? null,
    designStandard: record.SDA_Design_Standards__c ?? null,
    propertyType: record.Property_Type__c ?? null,
    tenancyStatus: record.enrtcr__Tenancy_Status__c ?? null,
    amenities: splitMultipicklist(record.enrtcr__Amenities__c),
    accessibility: splitMultipicklist(record.Accessibility__c),
    sharepointUrl: record.Sharepoint_Direct_Link__c ?? null,
    photos: [],
  }
}

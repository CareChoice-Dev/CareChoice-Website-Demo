import { describe, it, expect } from 'vitest'
import { mapSiteRecord } from '@/app/api/sda-vacancies/mapper'

describe('mapSiteRecord', () => {
  it('maps a Salesforce Site record to a vacancy DTO', () => {
    const sf = {
      Id: '001xx',
      Name: 'Brunswick Home',
      enrtcr__Total_Active_Beds__c: 3,
      enrtcr__Total_Beds_Occupied_Permanent__c: 1,
    }

    const result = mapSiteRecord(sf)

    expect(result).toMatchObject({
      id: '001xx',
      name: 'Brunswick Home',
      activeBeds: 3,
      occupiedBeds: 1,
      availableBeds: 2,
    })
  })

  it('handles missing numeric fields with 0', () => {
    const sf = {
      Id: '001yy',
      Name: 'Geelong Home',
      enrtcr__Total_Active_Beds__c: null,
      enrtcr__Total_Beds_Occupied_Permanent__c: null,
    }

    const result = mapSiteRecord(sf)

    expect(result.activeBeds).toBe(0)
    expect(result.occupiedBeds).toBe(0)
    expect(result.availableBeds).toBe(0)
  })

  it('builds a structured address from business fields, omitting nulls', () => {
    const sf = {
      Id: '001aa',
      Name: 'CC-Homes 28 Eaton Road, Mount Duneed',
      enrtcr__Business_Address_1__c: '28 Eaton Road',
      enrtcr__Business_Address_2__c: null,
      enrtcr__Business_Suburb__c: 'Mount Duneed',
      enrtcr__Business_State__c: 'VIC',
      enrtcr__Business_Postcode__c: '3216',
      enrtcr__Total_Active_Beds__c: 2,
      enrtcr__Total_Beds_Occupied_Permanent__c: 1,
    }

    const result = mapSiteRecord(sf)

    expect(result.address).toEqual({
      line1: '28 Eaton Road',
      line2: null,
      suburb: 'Mount Duneed',
      state: 'VIC',
      postcode: '3216',
      formatted: '28 Eaton Road, Mount Duneed VIC 3216',
    })
  })

  it('omits address.formatted when no address fields are present', () => {
    const sf = {
      Id: '001bb',
      Name: 'Stub',
      enrtcr__Business_Address_1__c: null,
      enrtcr__Business_Suburb__c: null,
      enrtcr__Business_State__c: null,
      enrtcr__Business_Postcode__c: null,
    }

    const result = mapSiteRecord(sf)

    expect(result.address?.formatted).toBe('')
  })

  it('exposes geolocation when latitude AND longitude are both present', () => {
    const sf = {
      Id: '001cc',
      Name: 'Geo',
      enrtcr__Business_Geolocation__Latitude__s: -38.15,
      enrtcr__Business_Geolocation__Longitude__s: 144.34,
    }

    const result = mapSiteRecord(sf)

    expect(result.geo).toEqual({ lat: -38.15, lng: 144.34 })
  })

  it('omits geolocation when only one coordinate is present', () => {
    const sf = {
      Id: '001dd',
      Name: 'PartialGeo',
      enrtcr__Business_Geolocation__Latitude__s: -38.15,
      enrtcr__Business_Geolocation__Longitude__s: null,
    }

    expect(mapSiteRecord(sf).geo).toBeNull()
  })

  it('splits multipicklist amenities and accessibility on semicolons', () => {
    const sf = {
      Id: '001ee',
      Name: 'PicklistTest',
      enrtcr__Amenities__c: 'Sleepover;Zoned rooms;Distress alarms',
      Accessibility__c: 'Wide doorways;Hoist mounts',
    }

    const result = mapSiteRecord(sf)

    expect(result.amenities).toEqual(['Sleepover', 'Zoned rooms', 'Distress alarms'])
    expect(result.accessibility).toEqual(['Wide doorways', 'Hoist mounts'])
  })

  it('returns empty arrays when multipicklists are null', () => {
    const sf = {
      Id: '001ff',
      Name: 'NoPicklists',
      enrtcr__Amenities__c: null,
      Accessibility__c: null,
    }

    const result = mapSiteRecord(sf)

    expect(result.amenities).toEqual([])
    expect(result.accessibility).toEqual([])
  })

  it('passes through design-standard, region, property type, tenancy, description, sharepoint link', () => {
    const sf = {
      Id: '001gg',
      Name: 'CC-Homes',
      SDA_Design_Standards__c: 'High Physical Support',
      enrtcr__Site_Region__c: 'Western',
      Property_Type__c: 'Shared house',
      enrtcr__Tenancy_Status__c: 'SDA Tenancy Agreement',
      enrtcr__Site_Description__c: 'A welcoming home.',
      Sharepoint_Direct_Link__c: 'https://carechoice1.sharepoint.com/sites/foo',
    }

    const result = mapSiteRecord(sf)

    expect(result.designStandard).toBe('High Physical Support')
    expect(result.region).toBe('Western')
    expect(result.propertyType).toBe('Shared house')
    expect(result.tenancyStatus).toBe('SDA Tenancy Agreement')
    expect(result.description).toBe('A welcoming home.')
    expect(result.sharepointUrl).toBe('https://carechoice1.sharepoint.com/sites/foo')
  })

  it('exposes an empty photos array by default (photos are joined in the route, not the mapper)', () => {
    const sf = { Id: '001kk', Name: 'Test' }
    const result = mapSiteRecord(sf)
    expect(result.photos).toEqual([])
  })
})

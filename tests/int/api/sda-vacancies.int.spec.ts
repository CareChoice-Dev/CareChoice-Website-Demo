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

    expect(result).toEqual({
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
})

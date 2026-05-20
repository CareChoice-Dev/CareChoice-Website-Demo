import { describe, it, expect } from 'vitest'
import { enquiryToSalesforce } from '@/lib/enquiry-to-salesforce'

describe('enquiryToSalesforce', () => {
  it('maps a client audience to a Lead with split name', () => {
    const result = enquiryToSalesforce({
      audience: 'client',
      fullName: 'Mira Tan',
      email: 'mira@example.com',
      phone: '0400 000 000',
      serviceInterest: 'sil',
      homePreference: 'Werribee',
      message: 'Looking for housing.',
    })

    expect(result.sobject).toBe('Lead')
    expect(result.data).toMatchObject({
      FirstName: 'Mira',
      LastName: 'Tan',
      Email: 'mira@example.com',
      Phone: '0400 000 000',
      Company: 'Personal enquiry',
      LeadSource: 'Website Demo',
    })
    expect((result.data as { Description: string }).Description).toContain('sil')
    expect((result.data as { Description: string }).Description).toContain('Werribee')
    expect((result.data as { Description: string }).Description).toContain('Looking for housing.')
  })

  it('maps a career audience to a Lead with LeadSource=Careers', () => {
    const result = enquiryToSalesforce({
      audience: 'career',
      fullName: 'Sam Lee',
      email: 'sam@example.com',
      role: 'Support Worker',
    })

    expect(result.sobject).toBe('Lead')
    expect((result.data as { LeadSource: string }).LeadSource).toBe('Careers')
    expect((result.data as { Description: string }).Description).toContain('Support Worker')
  })

  it('maps a referrer audience to a Case (not a Lead)', () => {
    const result = enquiryToSalesforce({
      audience: 'referrer',
      fullName: 'Alex Patel',
      email: 'alex@orgcorp.com',
      organisation: 'OrgCorp',
      role: 'Support Coordinator',
      message: 'Have a participant looking for SDA.',
    })

    expect(result.sobject).toBe('Case')
    expect(result.data).toMatchObject({
      Origin: 'Web',
      Status: 'New',
    })
    expect((result.data as { Subject: string }).Subject).toContain('OrgCorp')
    expect((result.data as { Description: string }).Description).toContain('Support Coordinator')
    expect((result.data as { Description: string }).Description).toContain('Have a participant looking for SDA.')
  })

  it('handles a single-name fullName (sets FirstName empty, LastName to the full string)', () => {
    const result = enquiryToSalesforce({
      audience: 'client',
      fullName: 'Madonna',
      email: 'm@example.com',
    })

    expect((result.data as { FirstName: string }).FirstName).toBe('')
    expect((result.data as { LastName: string }).LastName).toBe('Madonna')
  })
})

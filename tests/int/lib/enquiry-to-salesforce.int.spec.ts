import { describe, it, expect } from 'vitest'
import { enquiryToSalesforce } from '@/lib/enquiry-to-salesforce'

describe('enquiryToSalesforce', () => {
  it('maps a client-self audience to a Lead with split name and structured Description', () => {
    const result = enquiryToSalesforce({
      audience: 'client',
      enquiringFor: 'self',
      fullName: 'Mira Tan',
      email: 'mira@example.com',
      phone: '0400 000 000',
      serviceInterests: ['sil', 'sda'],
      postcode: 'Werribee 3030',
      ndisPlan: 'yes',
      supportNeeds: 'Mornings and evenings.',
      message: 'Looking for housing.',
      privacyConsent: true,
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
    const desc = (result.data as { Description: string }).Description
    expect(desc).toContain('=== About the enquiry ===')
    expect(desc).toContain('Enquiring for: self')
    expect(desc).toContain('Service interest: sil, sda')
    expect(desc).toContain('Postcode/suburb: Werribee 3030')
    expect(desc).toContain('NDIS plan: yes')
    expect(desc).toContain('Support requirements: Mornings and evenings.')
    expect(desc).toContain('=== Additional notes ===')
    expect(desc).toContain('Looking for housing.')
    expect(desc).toContain('Privacy consent confirmed at ')
  })

  it('maps client-other to a Lead with relationship + participant name', () => {
    const result = enquiryToSalesforce({
      audience: 'client',
      enquiringFor: 'other',
      clientRelationship: 'parent',
      participantFirstName: 'Sam',
      natureOfDisability: 'Autism spectrum.',
      fullName: 'Mira Tan',
      email: 'mira@example.com',
      privacyConsent: true,
    })

    expect(result.sobject).toBe('Lead')
    const desc = (result.data as { Description: string }).Description
    expect(desc).toContain('Enquiring on behalf of: Sam (parent)')
    expect(desc).toContain('Nature of disability: Autism spectrum.')
  })

  it('falls back to a friendly label when client-other omits participant name', () => {
    const result = enquiryToSalesforce({
      audience: 'client',
      enquiringFor: 'other',
      clientRelationship: 'carer',
      fullName: 'Mira Tan',
      email: 'mira@example.com',
      privacyConsent: true,
    })

    const desc = (result.data as { Description: string }).Description
    expect(desc).toContain('Enquiring on behalf of: a person they support (carer)')
  })

  it('maps a career audience to a Lead with LeadSource=Careers and employment context', () => {
    const result = enquiryToSalesforce({
      audience: 'career',
      careerRoleInterest: 'Support Worker',
      careerLocation: 'Werribee',
      employmentType: 'part-time',
      fullName: 'Sam Lee',
      email: 'sam@example.com',
      privacyConsent: true,
    })

    expect(result.sobject).toBe('Lead')
    expect(result.data).toMatchObject({
      Company: 'Career applicant',
      LeadSource: 'Careers',
    })
    const desc = (result.data as { Description: string }).Description
    expect(desc).toContain('=== Career interest ===')
    expect(desc).toContain('Role: Support Worker')
    expect(desc).toContain('Preferred location: Werribee')
    expect(desc).toContain('Employment type: part-time')
  })

  it('maps a referrer audience to a Case with structured Description', () => {
    const result = enquiryToSalesforce({
      audience: 'referrer',
      organisation: 'OrgCorp',
      referrerRole: 'support-coordinator',
      participantFirstName: 'Jamie',
      natureOfDisability: 'Cerebral palsy.',
      serviceInterests: ['sda'],
      postcode: '3030',
      ndisPlan: 'yes',
      supportNeeds: 'Weekday support.',
      fullName: 'Alex Patel',
      email: 'alex@orgcorp.com',
      message: 'Have a participant looking for SDA.',
      privacyConsent: true,
    })

    expect(result.sobject).toBe('Case')
    expect(result.data).toMatchObject({
      Origin: 'Web',
      Status: 'New',
    })
    expect((result.data as { Subject: string }).Subject).toContain('OrgCorp')
    const desc = (result.data as { Description: string }).Description
    expect(desc).toContain('Contact: Alex Patel')
    expect(desc).toContain('Email: alex@orgcorp.com')
    expect(desc).toContain('Organisation: OrgCorp')
    expect(desc).toContain('Role: support-coordinator')
    expect(desc).toContain('Participant first name: Jamie')
    expect(desc).toContain('Nature of disability: Cerebral palsy.')
    expect(desc).toContain('Service interest: sda')
    expect(desc).toContain('Have a participant looking for SDA.')
  })

  it('handles a single-name fullName (sets FirstName empty, LastName to the full string)', () => {
    const result = enquiryToSalesforce({
      audience: 'client',
      enquiringFor: 'self',
      fullName: 'Madonna',
      email: 'm@example.com',
      privacyConsent: true,
    })

    expect((result.data as { FirstName: string }).FirstName).toBe('')
    expect((result.data as { LastName: string }).LastName).toBe('Madonna')
  })

  it('maps salutation to the Salesforce Salutation field when not prefer-not-to-say', () => {
    const result = enquiryToSalesforce({
      audience: 'client',
      enquiringFor: 'self',
      salutation: 'Dr.',
      fullName: 'Mira Tan',
      email: 'mira@example.com',
      privacyConsent: true,
    })

    expect((result.data as { Salutation?: string }).Salutation).toBe('Dr.')
  })

  it('omits Salutation when salutation is prefer-not-to-say', () => {
    const result = enquiryToSalesforce({
      audience: 'client',
      enquiringFor: 'self',
      salutation: 'prefer-not-to-say',
      fullName: 'Mira Tan',
      email: 'mira@example.com',
      privacyConsent: true,
    })

    expect((result.data as { Salutation?: string }).Salutation).toBeUndefined()
  })

  it('includes heardFrom in Source section when it is a real value', () => {
    const result = enquiryToSalesforce({
      audience: 'client',
      enquiringFor: 'self',
      heardFrom: 'search',
      fullName: 'Mira Tan',
      email: 'mira@example.com',
      privacyConsent: true,
    })

    const desc = (result.data as { Description: string }).Description
    expect(desc).toContain('=== Source ===')
    expect(desc).toContain('How they heard: search')
  })

  it('omits the Source section when heardFrom is prefer-not-to-say', () => {
    const result = enquiryToSalesforce({
      audience: 'client',
      enquiringFor: 'self',
      heardFrom: 'prefer-not-to-say',
      fullName: 'Mira Tan',
      email: 'mira@example.com',
      privacyConsent: true,
    })

    const desc = (result.data as { Description: string }).Description
    expect(desc).not.toContain('=== Source ===')
  })
})

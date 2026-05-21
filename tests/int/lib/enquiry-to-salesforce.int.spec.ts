import { describe, it, expect } from 'vitest'
import { enquiryToSalesforce } from '@/lib/enquiry-to-salesforce'

describe('enquiryToSalesforce', () => {
  it('maps a client/self enquiry with full data to Lead with all custom fields', () => {
    const result = enquiryToSalesforce({
      audience: 'client',
      enquiringFor: 'self',
      serviceInterests: ['Behaviour Support', 'Respite'],
      postcode: '3030',
      fundingPlan: 'NDIS',
      supportNeeds: 'Mornings + evenings',
      salutation: 'Mr.',
      fullName: 'Mira Tan',
      email: 'mira@example.com',
      phone: '0400 000 000',
      heardFrom: 'Google',
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
      Salutation: 'Mr.',
      Is_Enquirer__c: 'Yes',
      What_CareChoice_services_are_of_interest__c: 'Behaviour Support;Respite',
      Participant_Residential_Address__PostalCode__s: '3030',
      Current_SDA_funding_in_NDIS_plan__c: 'NDIS',
      Support_required_Days_times_activities__c: 'Mornings + evenings',
      How_did_you_hear_about_CareChoice__c: 'Google',
      Anything_else_you_think_we_should_know__c: 'Looking for housing.',
      I_have_read_and_agree_to_Privacy_Stateme__c: true,
    })
  })

  it('maps a referrer enquiry to a Lead (not a Case) with relationship + organisation', () => {
    const result = enquiryToSalesforce({
      audience: 'referrer',
      relationshipToParticipant: 'Support coordinator',
      organisation: 'NDIS Partners Ltd',
      participantFirstName: 'Alex',
      fundingPlan: 'NDIS',
      fullName: 'Sam Lee',
      email: 'sam@partners.example',
      privacyConsent: true,
    })
    expect(result.sobject).toBe('Lead')
    expect(result.data).toMatchObject({
      Company: 'NDIS Partners Ltd',
      LeadSource: 'Website Demo - Referrer',
      Relationship_of_Referrer_to_the_Client__c: 'Support coordinator',
      Client_First_name__c: 'Alex',
      Current_SDA_funding_in_NDIS_plan__c: 'NDIS',
    })
  })

  it('maps client/other with relationship', () => {
    const result = enquiryToSalesforce({
      audience: 'client',
      enquiringFor: 'other',
      relationshipToParticipant: 'Parent',
      participantFirstName: 'Sam',
      fullName: 'Jordan Lee',
      email: 'jordan@example.com',
      privacyConsent: true,
    })
    expect(result.sobject).toBe('Lead')
    expect(result.data).toMatchObject({
      Is_Enquirer__c: 'No',
      Relationship_of_Referrer_to_the_Client__c: 'Parent',
      Client_First_name__c: 'Sam',
    })
  })

  it('omits Salutation when prefer-not-to-say', () => {
    const result = enquiryToSalesforce({
      audience: 'client',
      enquiringFor: 'self',
      salutation: 'prefer-not-to-say',
      fullName: 'A B',
      email: 'a@b.co',
      privacyConsent: true,
    })
    expect(result.data.Salutation).toBeUndefined()
  })

  it('omits How_did_you_hear when prefer-not-to-say', () => {
    const result = enquiryToSalesforce({
      audience: 'client',
      enquiringFor: 'self',
      heardFrom: 'prefer-not-to-say',
      fullName: 'A B',
      email: 'a@b.co',
      privacyConsent: true,
    })
    expect(result.data.How_did_you_hear_about_CareChoice__c).toBeUndefined()
  })

  it('career audience writes Lead with Description for career-specific data', () => {
    const result = enquiryToSalesforce({
      audience: 'career',
      careerRoleInterest: 'Support Worker',
      careerLocation: 'Geelong',
      employmentType: 'part-time',
      fullName: 'Sam Lee',
      email: 'sam@example.com',
      privacyConsent: true,
    })
    expect(result.sobject).toBe('Lead')
    expect(result.data.Company).toBe('Career applicant')
    expect(result.data.LeadSource).toBe('Careers')
    expect(result.data.Description).toContain('Support Worker')
    expect(result.data.Description).toContain('Geelong')
    expect(result.data.Description).toContain('part-time')
  })

  it('handles a single-name fullName', () => {
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
})

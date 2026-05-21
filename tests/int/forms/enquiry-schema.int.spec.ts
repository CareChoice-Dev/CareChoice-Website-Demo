import { describe, it, expect } from 'vitest'
import { enquirySchema } from '@/components/forms/enquiry-schema'

describe('enquirySchema', () => {
  it('accepts a valid client enquiry', () => {
    const result = enquirySchema.safeParse({
      audience: 'client',
      enquiringFor: 'self',
      serviceInterests: [
        'Supported Independent Living (over 10 hours)',
        'Specialist Disability Housing',
      ],
      postcode: 'Werribee 3030',
      fundingPlan: 'NDIS',
      supportNeeds: 'Mornings and evenings.',
      fullName: 'Mira Tan',
      email: 'mira@example.com',
      phone: '0400 000 000',
      message: 'Looking for housing options.',
      privacyConsent: true,
    })
    expect(result.success).toBe(true)
  })

  it('rejects when audience is missing', () => {
    const result = enquirySchema.safeParse({
      fullName: 'A',
      email: 'a@b.co',
      privacyConsent: true,
    })
    expect(result.success).toBe(false)
  })

  it('rejects invalid email', () => {
    const result = enquirySchema.safeParse({
      audience: 'client',
      fullName: 'A',
      email: 'not-an-email',
      privacyConsent: true,
    })
    expect(result.success).toBe(false)
  })

  it('requires fullName + email', () => {
    const result = enquirySchema.safeParse({
      audience: 'career',
      privacyConsent: true,
    })
    expect(result.success).toBe(false)
  })

  it('rejects when privacyConsent is missing', () => {
    const result = enquirySchema.safeParse({
      audience: 'client',
      fullName: 'Mira Tan',
      email: 'mira@example.com',
    })
    expect(result.success).toBe(false)
  })

  it('rejects when privacyConsent is false (must be opt-in)', () => {
    const result = enquirySchema.safeParse({
      audience: 'client',
      fullName: 'Mira Tan',
      email: 'mira@example.com',
      privacyConsent: false,
    })
    expect(result.success).toBe(false)
  })

  it('accepts a referrer with organisation + relationshipToParticipant', () => {
    const result = enquirySchema.safeParse({
      audience: 'referrer',
      organisation: 'OrgCorp',
      relationshipToParticipant: 'Support coordinator',
      participantFirstName: 'Jamie',
      natureOfDisability: 'Cerebral palsy.',
      serviceInterests: ['Specialist Disability Housing', '24 Hour Complex Support'],
      postcode: '3030',
      fundingPlan: 'NDIS',
      fullName: 'Alex Patel',
      email: 'alex@orgcorp.com',
      privacyConsent: true,
    })
    expect(result.success).toBe(true)
  })

  it('rejects a referrer with an invalid relationshipToParticipant value', () => {
    const result = enquirySchema.safeParse({
      audience: 'referrer',
      relationshipToParticipant: 'random-junk',
      fullName: 'Alex Patel',
      email: 'alex@orgcorp.com',
      privacyConsent: true,
    })
    expect(result.success).toBe(false)
  })

  it('accepts a client-other enquiry with relationship + participant info', () => {
    const result = enquirySchema.safeParse({
      audience: 'client',
      enquiringFor: 'other',
      relationshipToParticipant: 'Parent',
      participantFirstName: 'Sam',
      natureOfDisability: 'Autism spectrum.',
      serviceInterests: ['Supported Independent Living (over 10 hours)'],
      fundingPlan: 'Unsure',
      fullName: 'Mira Tan',
      email: 'mira@example.com',
      privacyConsent: true,
    })
    expect(result.success).toBe(true)
  })

  it('accepts a career enquiry with employmentType', () => {
    const result = enquirySchema.safeParse({
      audience: 'career',
      careerRoleInterest: 'Support Worker',
      careerLocation: 'Werribee',
      employmentType: 'part-time',
      fullName: 'Sam Lee',
      email: 'sam@example.com',
      privacyConsent: true,
    })
    expect(result.success).toBe(true)
  })

  it('rejects an invalid serviceInterests value', () => {
    const result = enquirySchema.safeParse({
      audience: 'client',
      enquiringFor: 'self',
      serviceInterests: ['not-a-service'],
      fullName: 'Mira Tan',
      email: 'mira@example.com',
      privacyConsent: true,
    })
    expect(result.success).toBe(false)
  })

  it('accepts a valid salutation + heardFrom value', () => {
    const result = enquirySchema.safeParse({
      audience: 'client',
      enquiringFor: 'self',
      salutation: 'Dr.',
      heardFrom: 'Google',
      fullName: 'Mira Tan',
      email: 'mira@example.com',
      privacyConsent: true,
    })
    expect(result.success).toBe(true)
  })
})

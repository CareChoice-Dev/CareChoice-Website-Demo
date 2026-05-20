import { describe, it, expect } from 'vitest'
import { enquirySchema } from '@/components/forms/enquiry-schema'

describe('enquirySchema', () => {
  it('accepts a valid client enquiry', () => {
    const result = enquirySchema.safeParse({
      audience: 'client',
      serviceInterest: 'sil',
      homePreference: 'Werribee',
      fullName: 'Mira Tan',
      email: 'mira@example.com',
      phone: '0400 000 000',
      message: 'Looking for housing options.',
    })
    expect(result.success).toBe(true)
  })

  it('rejects when audience is missing', () => {
    const result = enquirySchema.safeParse({
      fullName: 'A',
      email: 'a@b.co',
    })
    expect(result.success).toBe(false)
  })

  it('rejects invalid email', () => {
    const result = enquirySchema.safeParse({
      audience: 'client',
      fullName: 'A',
      email: 'not-an-email',
    })
    expect(result.success).toBe(false)
  })

  it('requires fullName + email', () => {
    const result = enquirySchema.safeParse({
      audience: 'career',
    })
    expect(result.success).toBe(false)
  })
})

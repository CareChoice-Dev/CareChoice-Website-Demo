import { z } from 'zod'

export const SALUTATIONS = [
  'prefer-not-to-say',
  'Mr.',
  'Mrs.',
  'Ms.',
  'Mx.',
  'Dr.',
  'Prof.',
] as const
export const SERVICE_INTERESTS = [
  'sil',
  'sda',
  'complex-care',
  'community-access',
  'respite',
  'pbs',
  'allied-health',
  'other',
] as const
export const NDIS_STATUS = ['yes', 'no', 'unsure'] as const
export const ENQUIRING_FOR = ['self', 'other'] as const
export const CLIENT_RELATIONSHIPS = [
  'parent',
  'sibling',
  'spouse',
  'child',
  'other-family',
  'friend',
  'carer',
  'other',
] as const
export const REFERRER_ROLES = [
  'support-coordinator',
  'specialist-support-coordinator',
  'case-manager',
  'allied-health',
  'hospital',
  'lac',
  'social-worker',
  'behaviour-support',
  'disability-liaison',
  'other',
] as const
export const EMPLOYMENT_TYPES = ['full-time', 'part-time', 'casual', 'contract', 'open'] as const
export const HEARD_FROM = [
  'prefer-not-to-say',
  'search',
  'family-friend',
  'allied-health',
  'ndis-related',
  'hospital',
  'social-media',
  'newsletter',
  'advertising',
  'other',
] as const

export const enquirySchema = z.object({
  audience: z.enum(['client', 'referrer', 'career']),
  enquiringFor: z.enum(ENQUIRING_FOR).optional(),

  // Participant-shaped fields (used by client + referrer)
  serviceInterests: z.array(z.enum(SERVICE_INTERESTS)).optional(),
  postcode: z.string().optional(),
  ndisPlan: z.enum(NDIS_STATUS).optional(),
  supportNeeds: z.string().optional(),
  participantFirstName: z.string().optional(),
  natureOfDisability: z.string().optional(),

  // Client-other branch
  clientRelationship: z.enum(CLIENT_RELATIONSHIPS).optional(),

  // Referrer
  organisation: z.string().optional(),
  referrerRole: z.enum(REFERRER_ROLES).optional(),

  // Career
  careerRoleInterest: z.string().optional(),
  careerLocation: z.string().optional(),
  employmentType: z.enum(EMPLOYMENT_TYPES).optional(),

  // Step 3 — contact + meta
  salutation: z.enum(SALUTATIONS).optional(),
  fullName: z.string().min(1, 'Please enter your name.'),
  email: z.string().email('Please enter a valid email.'),
  phone: z.string().optional(),
  heardFrom: z.enum(HEARD_FROM).optional(),
  message: z.string().optional(),

  // Privacy
  privacyConsent: z.literal(true, {
    errorMap: () => ({
      message: 'Please agree to the Privacy Statement to send your enquiry.',
    }),
  }),
})

export type EnquiryPayload = z.infer<typeof enquirySchema>

import { z } from 'zod'

export const SALUTATIONS = [
  'prefer-not-to-say',
  'Mr.',
  'Ms.',
  'Mrs.',
  'Mx.',
  'Dr.',
  'Prof.',
] as const

// EXACTLY matches Salesforce What_CareChoice_services_are_of_interest__c picklist values
export const SERVICE_INTERESTS = [
  '24 Hour Complex Support',
  'Behaviour Support',
  'CareChoice Homes',
  'Community access',
  'Community Nursing',
  'Custodial/Community Re-Entry',
  'Disability Services',
  'Rapid Hospital Discharge',
  'Respite',
  'Specialist Disability Housing',
  'Specialist Support Coordination',
  'Support Coordination',
  'Supported Independent Living (over 10 hours)',
  'Supported Independent Living (under 10 hours)',
  'TAC/Worksafe Support',
] as const

// EXACTLY matches Salesforce Current_SDA_funding_in_NDIS_plan__c picklist values
export const FUNDING_PLAN = ['NDIS', 'TAC', 'Work Cover Plan', 'Unsure'] as const

export const ENQUIRING_FOR = ['self', 'other'] as const

// EXACTLY matches Salesforce Relationship_of_Referrer_to_the_Client__c picklist values
export const RELATIONSHIPS = [
  'Allied Health',
  'Associated Provider',
  'Behaviour Support Practitioner',
  'Case Manager',
  'Crisis housing provider',
  'Disability Liaison Officer',
  'Family Member',
  'Hospital',
  'LAC',
  'Other',
  'Other family member',
  'Parent',
  'Referrer',
  'Sibling',
  'Social Worker',
  'Spec Support Coordinator',
  'Spouse',
  'Support coordinator',
] as const

// EXACTLY matches Salesforce How_did_you_hear_about_CareChoice__c picklist values (curated to 12)
export const HEARD_FROM = [
  'prefer-not-to-say',
  'CareChoice website',
  'Google',
  'Family/friend',
  'Allied Health Professional - Occupational therapist',
  'Allied Health Professional - Speech Pathologist',
  'Support coordinator',
  'NDIS- LAC',
  'Hospital',
  'Social media',
  'Facebook',
  'Current CareChoice client',
  'Other',
] as const

export const EMPLOYMENT_TYPES = ['full-time', 'part-time', 'casual', 'contract', 'open'] as const

export const enquirySchema = z.object({
  audience: z.enum(['client', 'referrer', 'career']),
  enquiringFor: z.enum(ENQUIRING_FOR).optional(),

  // Participant-shaped (client + referrer)
  serviceInterests: z.array(z.enum(SERVICE_INTERESTS)).optional(),
  postcode: z.string().optional(),
  fundingPlan: z.enum(FUNDING_PLAN).optional(),
  supportNeeds: z.string().optional(),
  participantFirstName: z.string().optional(),
  natureOfDisability: z.string().optional(),

  // Single relationship field (used by client/other AND referrer)
  relationshipToParticipant: z.enum(RELATIONSHIPS).optional(),

  // Referrer
  organisation: z.string().optional(),

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

  privacyConsent: z.literal(true, {
    message: 'Please agree to the Privacy Statement to send your enquiry.',
  }),
})

export type EnquiryPayload = z.infer<typeof enquirySchema>

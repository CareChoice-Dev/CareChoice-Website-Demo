import { z } from 'zod'

export const enquirySchema = z.object({
  audience: z.enum(['client', 'referrer', 'career']),
  serviceInterest: z.string().optional(),
  homePreference: z.string().optional(),
  organisation: z.string().optional(),
  role: z.string().optional(),
  fullName: z.string().min(1, 'Please enter your name.'),
  email: z.string().email('Please enter a valid email.'),
  phone: z.string().optional(),
  message: z.string().optional(),
})

export type EnquiryPayload = z.infer<typeof enquirySchema>

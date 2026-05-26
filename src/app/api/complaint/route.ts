import { NextResponse } from 'next/server'
import { z } from 'zod'

/**
 * Complaints intake — PLACEHOLDER handler.
 *
 * Validates and logs the complaint, then returns success. It deliberately does
 * NOT yet write to Salesforce; wiring it to a Case (Type = 'Complaint') is a
 * follow-up. Keeping it a no-op write means the NDIS-required complaints
 * channel is live and usable in the demo without committing to a CRM shape.
 */

const complaintSchema = z.object({
  // "anonymous" lets a complainant omit identifying details (NDIS allows this).
  anonymous: z.boolean().default(false),
  fullName: z.string().trim().optional(),
  email: z.string().trim().email('Please enter a valid email.').optional().or(z.literal('')),
  phone: z.string().trim().optional(),
  complaintAbout: z.string().trim().min(1, 'Please tell us what your complaint is about.'),
  whatHappened: z.string().trim().min(1, 'Please describe what happened.'),
  desiredOutcome: z.string().trim().optional(),
  consent: z.boolean().default(false),
})

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 })
  }

  const parsed = complaintSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed.', issues: parsed.error.issues },
      { status: 422 },
    )
  }

  // Placeholder: log a redacted record so the demo shows intake working.
  // Replace with a Salesforce Case write (Type = 'Complaint') when ready.
  console.log('[complaint] received (placeholder — not yet written to CRM)', {
    receivedAt: new Date().toISOString(),
    anonymous: parsed.data.anonymous,
    hasContact: Boolean(parsed.data.email || parsed.data.phone),
    aboutLength: parsed.data.complaintAbout.length,
  })

  return NextResponse.json({ ok: true })
}

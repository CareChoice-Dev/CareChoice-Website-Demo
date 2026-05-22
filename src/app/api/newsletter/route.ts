import { NextResponse } from 'next/server'
import { z } from 'zod'
import { runMutation } from '@/lib/salesforce'

const newsletterSchema = z.object({
  email: z.string().email('Please enter a valid email.'),
  consent: z.literal(true, {
    message: 'Please agree to the Privacy Statement to subscribe.',
  }),
})

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 })
  }

  const parsed = newsletterSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed.', issues: parsed.error.issues },
      { status: 422 },
    )
  }

  const leadData: Record<string, unknown> = {
    LastName: 'Newsletter signup',
    Email: parsed.data.email,
    Company: 'Newsletter signup',
    LeadSource: 'Newsletter',
    I_have_read_and_agree_to_Privacy_Stateme__c: true,
  }

  let salesforceId: string | undefined
  try {
    const result = await runMutation('Lead', leadData)
    salesforceId = result.id
    console.log('[newsletter] Salesforce write OK', {
      receivedAt: new Date().toISOString(),
      id: salesforceId,
    })
  } catch (error) {
    console.error('[newsletter] Salesforce write FAILED — signup still accepted', {
      receivedAt: new Date().toISOString(),
      email: parsed.data.email,
      error: error instanceof Error ? error.message : 'unknown',
    })
  }

  return NextResponse.json({ ok: true, salesforceId })
}

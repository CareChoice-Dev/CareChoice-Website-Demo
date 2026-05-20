import { NextResponse } from 'next/server'
import { enquirySchema } from '@/components/forms/enquiry-schema'
import { enquiryToSalesforce } from '@/lib/enquiry-to-salesforce'
import { runMutation } from '@/lib/salesforce'

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 })
  }

  const parsed = enquirySchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed.', issues: parsed.error.issues },
      { status: 422 },
    )
  }

  const target = enquiryToSalesforce(parsed.data)

  let salesforceId: string | undefined
  try {
    const result = await runMutation(target.sobject, target.data)
    salesforceId = result.id
    console.log('[enquiry] Salesforce write OK', {
      receivedAt: new Date().toISOString(),
      sobject: target.sobject,
      id: salesforceId,
      audience: parsed.data.audience,
    })
  } catch (error) {
    console.error('[enquiry] Salesforce write FAILED — payload still accepted', {
      receivedAt: new Date().toISOString(),
      sobject: target.sobject,
      audience: parsed.data.audience,
      error: error instanceof Error ? error.message : 'unknown',
      payload: parsed.data,
    })
  }

  return NextResponse.json({ ok: true, salesforceId })
}

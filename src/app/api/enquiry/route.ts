import { NextResponse } from 'next/server'
import { enquirySchema } from '@/components/forms/enquiry-schema'

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

  console.log('[enquiry] received', {
    receivedAt: new Date().toISOString(),
    ...parsed.data,
  })

  return NextResponse.json({ ok: true })
}

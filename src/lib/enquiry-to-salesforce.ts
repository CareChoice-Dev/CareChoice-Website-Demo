import type { EnquiryPayload } from '@/components/forms/enquiry-schema'

export interface SalesforceWriteTarget {
  sobject: 'Lead' | 'Case'
  data: Record<string, unknown>
}

function splitName(fullName: string): { FirstName: string; LastName: string } {
  const parts = fullName.trim().split(/\s+/)
  if (parts.length === 1) {
    return { FirstName: '', LastName: parts[0] }
  }
  return {
    FirstName: parts.slice(0, -1).join(' '),
    LastName: parts[parts.length - 1],
  }
}

function buildDescription(p: EnquiryPayload): string {
  const lines: string[] = []

  if (p.audience === 'client') {
    lines.push('=== About the enquiry ===')
    if (p.enquiringFor === 'self') lines.push('Enquiring for: self')
    if (p.enquiringFor === 'other') {
      const rel = p.clientRelationship ? ` (${p.clientRelationship})` : ''
      const name = p.participantFirstName ? p.participantFirstName : 'a person they support'
      lines.push(`Enquiring on behalf of: ${name}${rel}`)
    }
    if (p.natureOfDisability) lines.push(`Nature of disability: ${p.natureOfDisability}`)
    if (p.serviceInterests?.length)
      lines.push(`Service interest: ${p.serviceInterests.join(', ')}`)
    if (p.postcode) lines.push(`Postcode/suburb: ${p.postcode}`)
    if (p.ndisPlan) lines.push(`NDIS plan: ${p.ndisPlan}`)
    if (p.supportNeeds) lines.push(`Support requirements: ${p.supportNeeds}`)
  } else if (p.audience === 'referrer') {
    lines.push('=== About the enquiry ===')
    if (p.organisation) lines.push(`Organisation: ${p.organisation}`)
    if (p.referrerRole) lines.push(`Role: ${p.referrerRole}`)
    if (p.participantFirstName) lines.push(`Participant first name: ${p.participantFirstName}`)
    if (p.natureOfDisability) lines.push(`Nature of disability: ${p.natureOfDisability}`)
    if (p.serviceInterests?.length)
      lines.push(`Service interest: ${p.serviceInterests.join(', ')}`)
    if (p.postcode) lines.push(`Postcode/suburb: ${p.postcode}`)
    if (p.ndisPlan) lines.push(`NDIS plan: ${p.ndisPlan}`)
    if (p.supportNeeds) lines.push(`Support requirements: ${p.supportNeeds}`)
  } else {
    lines.push('=== Career interest ===')
    if (p.careerRoleInterest) lines.push(`Role: ${p.careerRoleInterest}`)
    if (p.careerLocation) lines.push(`Preferred location: ${p.careerLocation}`)
    if (p.employmentType) lines.push(`Employment type: ${p.employmentType}`)
  }

  if (p.heardFrom && p.heardFrom !== 'prefer-not-to-say') {
    lines.push('')
    lines.push('=== Source ===')
    lines.push(`How they heard: ${p.heardFrom}`)
  }

  if (p.message) {
    lines.push('')
    lines.push('=== Additional notes ===')
    lines.push(p.message)
  }

  lines.push('')
  lines.push(`Privacy consent confirmed at ${new Date().toISOString()}`)

  return lines.join('\n')
}

export function enquiryToSalesforce(payload: EnquiryPayload): SalesforceWriteTarget {
  const description = buildDescription(payload)

  if (payload.audience === 'referrer') {
    return {
      sobject: 'Case',
      data: {
        Subject: `Website enquiry — Referrer${payload.organisation ? ` (${payload.organisation})` : ''}`,
        Description: [
          `Contact: ${payload.fullName}`,
          `Email: ${payload.email}`,
          payload.phone ? `Phone: ${payload.phone}` : null,
          '',
          description,
        ]
          .filter((l) => l !== null)
          .join('\n'),
        Origin: 'Web',
        Status: 'New',
      },
    }
  }

  const { FirstName, LastName } = splitName(payload.fullName)
  const isClient = payload.audience === 'client'

  let Company: string
  if (isClient) {
    Company = 'Personal enquiry'
  } else {
    // career
    Company = 'Career applicant'
  }

  const data: Record<string, unknown> = {
    FirstName,
    LastName,
    Email: payload.email,
    Phone: payload.phone ?? '',
    Company,
    LeadSource: isClient ? 'Website Demo' : 'Careers',
    Description: description,
  }

  if (payload.salutation && payload.salutation !== 'prefer-not-to-say') {
    data.Salutation = payload.salutation
  }

  return {
    sobject: 'Lead',
    data,
  }
}

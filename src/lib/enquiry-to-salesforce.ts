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

export function enquiryToSalesforce(payload: EnquiryPayload): SalesforceWriteTarget {
  if (payload.audience === 'referrer') {
    const descLines = [
      payload.organisation && `Organisation: ${payload.organisation}`,
      payload.role && `Role: ${payload.role}`,
      payload.fullName && `Contact: ${payload.fullName}`,
      payload.email && `Email: ${payload.email}`,
      payload.phone && `Phone: ${payload.phone}`,
      payload.message && `\nMessage:\n${payload.message}`,
    ].filter(Boolean)

    return {
      sobject: 'Case',
      data: {
        Subject: `Website enquiry — Referrer${payload.organisation ? ` (${payload.organisation})` : ''}`,
        Description: descLines.join('\n'),
        Origin: 'Web',
        Status: 'New',
      },
    }
  }

  const { FirstName, LastName } = splitName(payload.fullName)
  const isClient = payload.audience === 'client'

  const descLines = [
    isClient && payload.serviceInterest && `Service interest: ${payload.serviceInterest}`,
    isClient && payload.homePreference && `Home preference: ${payload.homePreference}`,
    !isClient && payload.role && `Role interest: ${payload.role}`,
    payload.message && `\nMessage:\n${payload.message}`,
  ].filter(Boolean)

  return {
    sobject: 'Lead',
    data: {
      FirstName,
      LastName,
      Email: payload.email,
      Phone: payload.phone ?? '',
      Company: isClient ? 'Personal enquiry' : 'Career applicant',
      LeadSource: isClient ? 'Website Demo' : 'Careers',
      Description: descLines.join('\n'),
    },
  }
}

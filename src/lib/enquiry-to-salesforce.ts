import type { EnquiryPayload } from '@/components/forms/enquiry-schema'

export interface SalesforceWriteTarget {
  sobject: 'Lead'
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

export function enquiryToSalesforce(p: EnquiryPayload): SalesforceWriteTarget {
  const { FirstName, LastName } = splitName(p.fullName)

  // Company defaults per audience (Lead requires Company)
  const Company =
    p.audience === 'career'
      ? 'Career applicant'
      : p.audience === 'referrer'
        ? p.organisation?.trim() || 'Referrer organisation'
        : 'Personal enquiry'

  const LeadSource =
    p.audience === 'career'
      ? 'Careers'
      : p.audience === 'referrer'
        ? 'Website Demo - Referrer'
        : 'Website Demo'

  const data: Record<string, unknown> = {
    FirstName,
    LastName,
    Email: p.email,
    Phone: p.phone ?? '',
    Company,
    LeadSource,
  }

  // Standard Salutation — omit when user chose "prefer not to say"
  if (p.salutation && p.salutation !== 'prefer-not-to-say') {
    data.Salutation = p.salutation
  }

  // Is_Enquirer__c (Yes/No/Unsure) — only meaningful for client audience
  if (p.audience === 'client' && p.enquiringFor === 'self') {
    data.Is_Enquirer__c = 'Yes'
  } else if (p.audience === 'client' && p.enquiringFor === 'other') {
    data.Is_Enquirer__c = 'No'
  }

  // Single relationship field used by client-other and referrer alike
  if (p.relationshipToParticipant) {
    data.Relationship_of_Referrer_to_the_Client__c = p.relationshipToParticipant
  }

  // Participant first name (when enquirer is not the participant, OR when referrer)
  if (p.participantFirstName) {
    data.Client_First_name__c = p.participantFirstName
  }

  // Nature of disability
  if (p.natureOfDisability) {
    data.Nature_of_disability__c = p.natureOfDisability
  }

  // Funding plan
  if (p.fundingPlan) {
    data.Current_SDA_funding_in_NDIS_plan__c = p.fundingPlan
  }

  // Multi-select services — REST API wants semicolon-joined
  if (p.serviceInterests && p.serviceInterests.length > 0) {
    data.What_CareChoice_services_are_of_interest__c = p.serviceInterests.join(';')
  }

  // Support requirements (free text)
  if (p.supportNeeds) {
    data.Support_required_Days_times_activities__c = p.supportNeeds
  }

  // Postcode → address compound sub-field
  if (p.postcode) {
    data.Participant_Residential_Address__PostalCode__s = p.postcode
  }

  // How they heard about us (omit prefer-not-to-say)
  if (p.heardFrom && p.heardFrom !== 'prefer-not-to-say') {
    data.How_did_you_hear_about_CareChoice__c = p.heardFrom
  }

  // Anything else / additional notes
  if (p.message) {
    data.Anything_else_you_think_we_should_know__c = p.message
  }

  // Privacy consent (boolean — required by schema to be true, but defensive)
  data.I_have_read_and_agree_to_Privacy_Stateme__c = p.privacyConsent === true

  // Career-specific fields don't have dedicated Lead custom fields in this org.
  // Surface role + location + employment type in the standard Description field
  // so the intake team can read them.
  if (p.audience === 'career') {
    const lines: string[] = ['=== Career enquiry ===']
    if (p.careerRoleInterest) lines.push(`Role interest: ${p.careerRoleInterest}`)
    if (p.careerLocation) lines.push(`Preferred location: ${p.careerLocation}`)
    if (p.employmentType) lines.push(`Employment type: ${p.employmentType}`)
    if (lines.length > 1) {
      data.Description = lines.join('\n')
    }
  }

  // For referrer: surface organisation in Description too (Lead's Company is set to it; but a
  // second field makes intake faster)
  if (p.audience === 'referrer' && p.organisation) {
    const existing = (data.Description as string) ?? ''
    const note = `Referrer organisation: ${p.organisation}`
    data.Description = existing ? `${existing}\n${note}` : note
  }

  return { sobject: 'Lead', data }
}

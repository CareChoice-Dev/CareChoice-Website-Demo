'use client'

import type { EnquiryDraft } from './EnquiryForm'
import {
  EMPLOYMENT_TYPES,
  FUNDING_PLAN,
  RELATIONSHIPS,
  SERVICE_INTERESTS,
} from './enquiry-schema'

interface Props {
  draft: EnquiryDraft
  onChange: (patch: Partial<EnquiryDraft>) => void
}

const inputClass =
  'w-full border-2 border-cc-black px-3 py-2 rounded-none bg-cc-white focus:outline-none focus:ring-0 focus:border-cc-magenta'

const labelClass = 'flex flex-col gap-1'
const labelTextClass = 'font-semibold text-sm'
const helperClass = 'text-xs text-cc-fg-muted'

// Display labels are nicer than the raw Salesforce picklist strings. The option `value`
// MUST be the exact Salesforce string — only the visible label is humanised.
const SERVICE_INTEREST_LABELS: Record<(typeof SERVICE_INTERESTS)[number], string> = {
  '24 Hour Complex Support': '24-hour complex support',
  'Behaviour Support': 'Behaviour support',
  'CareChoice Homes': 'CareChoice Homes',
  'Community access': 'Community access',
  'Community Nursing': 'Community nursing',
  'Custodial/Community Re-Entry': 'Custodial / community re-entry',
  'Disability Services': 'Disability services',
  'Rapid Hospital Discharge': 'Rapid hospital discharge',
  Respite: 'Respite',
  'Specialist Disability Housing': 'Specialist disability housing (SDA)',
  'Specialist Support Coordination': 'Specialist support coordination',
  'Support Coordination': 'Support coordination',
  'Supported Independent Living (over 10 hours)': 'Supported independent living — 10+ hrs/week',
  'Supported Independent Living (under 10 hours)': 'Supported independent living — under 10 hrs/week',
  'TAC/Worksafe Support': 'TAC / WorkSafe support',
}

// Subset of the Salesforce relationship picklist shown to client+other audiences (family role).
const FAMILY_RELATIONSHIPS = [
  'Parent',
  'Sibling',
  'Spouse',
  'Other family member',
  'Family Member',
  'Other',
] as const

// Subset of the Salesforce relationship picklist shown to referrer audiences (professional role).
const PROFESSIONAL_RELATIONSHIPS = [
  'Allied Health',
  'Associated Provider',
  'Behaviour Support Practitioner',
  'Case Manager',
  'Crisis housing provider',
  'Disability Liaison Officer',
  'Hospital',
  'LAC',
  'Referrer',
  'Social Worker',
  'Spec Support Coordinator',
  'Support coordinator',
  'Other',
] as const

const RELATIONSHIP_LABELS: Record<(typeof RELATIONSHIPS)[number], string> = {
  'Allied Health': 'Allied health professional',
  'Associated Provider': 'Associated provider',
  'Behaviour Support Practitioner': 'Behaviour support practitioner',
  'Case Manager': 'Case manager',
  'Crisis housing provider': 'Crisis housing provider',
  'Disability Liaison Officer': 'Disability liaison officer',
  'Family Member': 'Other family member',
  Hospital: 'Hospital',
  LAC: 'LAC (Local Area Coordinator)',
  Other: 'Other',
  'Other family member': 'Other family member',
  Parent: 'Parent',
  Referrer: 'Referrer',
  Sibling: 'Sibling',
  'Social Worker': 'Social worker',
  'Spec Support Coordinator': 'Specialist support coordinator',
  Spouse: 'Spouse / partner',
  'Support coordinator': 'Support coordinator',
}

const EMPLOYMENT_TYPE_LABELS: Record<(typeof EMPLOYMENT_TYPES)[number], string> = {
  'full-time': 'Full-time',
  'part-time': 'Part-time',
  casual: 'Casual',
  contract: 'Contract',
  open: 'Open to anything',
}

const FUNDING_PLAN_LABELS: Record<(typeof FUNDING_PLAN)[number], string> = {
  NDIS: 'NDIS plan',
  TAC: 'TAC',
  'Work Cover Plan': 'WorkCover plan',
  Unsure: 'Not sure yet',
}

function ServiceInterestsField({ draft, onChange }: Props) {
  const current = draft.serviceInterests ?? []
  const toggle = (key: (typeof SERVICE_INTERESTS)[number]) => {
    if (current.includes(key)) {
      onChange({ serviceInterests: current.filter((s) => s !== key) })
    } else {
      onChange({ serviceInterests: [...current, key] })
    }
  }
  return (
    <fieldset className={labelClass}>
      <legend className={labelTextClass}>Services you&apos;re interested in.</legend>
      <span className={helperClass}>Choose any that apply. We&apos;ll talk through the rest.</span>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
        {SERVICE_INTERESTS.map((key) => {
          const checked = current.includes(key)
          const id = `service-${key.replace(/\W+/g, '-').toLowerCase()}`
          return (
            <label
              key={key}
              htmlFor={id}
              className={`cursor-pointer border-2 border-cc-black px-3 py-2 flex items-center gap-2 ${
                checked ? 'bg-cc-surface-pink' : 'bg-cc-white hover:bg-cc-surface-pink/60'
              }`}
            >
              <input
                id={id}
                type="checkbox"
                checked={checked}
                onChange={() => toggle(key)}
                className="w-4 h-4 accent-cc-magenta"
              />
              <span className="text-sm font-semibold">{SERVICE_INTEREST_LABELS[key]}</span>
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}

function PostcodeField({ draft, onChange }: Props) {
  return (
    <label className={labelClass}>
      <span className={labelTextClass}>Participant postcode or suburb.</span>
      <input
        type="text"
        value={draft.postcode ?? ''}
        onChange={(e) => onChange({ postcode: e.target.value })}
        className={inputClass}
        placeholder="e.g. Werribee 3030"
      />
    </label>
  )
}

function FundingPlanField({ draft, onChange }: Props) {
  return (
    <label className={labelClass}>
      <span className={labelTextClass}>What kind of funding plan does the participant have?</span>
      <select
        value={draft.fundingPlan ?? 'Unsure'}
        onChange={(e) =>
          onChange({ fundingPlan: e.target.value as (typeof FUNDING_PLAN)[number] })
        }
        className={inputClass}
      >
        {FUNDING_PLAN.map((s) => (
          <option key={s} value={s}>
            {FUNDING_PLAN_LABELS[s]}
          </option>
        ))}
      </select>
    </label>
  )
}

function SupportNeedsField({ draft, onChange }: Props) {
  return (
    <label className={labelClass}>
      <span className={labelTextClass}>Type of support needed.</span>
      <textarea
        rows={3}
        value={draft.supportNeeds ?? ''}
        onChange={(e) => onChange({ supportNeeds: e.target.value })}
        className={inputClass}
        placeholder="Days, times, activities (e.g. mornings and evenings, weekday support, medication management)"
      />
    </label>
  )
}

function ParticipantNameField({
  draft,
  onChange,
  showConsentNote,
}: Props & { showConsentNote?: boolean }) {
  return (
    <label className={labelClass}>
      <span className={labelTextClass}>Participant&apos;s first name.</span>
      {showConsentNote && (
        <span className={helperClass}>Only share if you have consent.</span>
      )}
      <input
        type="text"
        value={draft.participantFirstName ?? ''}
        onChange={(e) => onChange({ participantFirstName: e.target.value })}
        className={inputClass}
      />
    </label>
  )
}

function NatureOfDisabilityField({ draft, onChange }: Props) {
  return (
    <label className={labelClass}>
      <span className={labelTextClass}>Nature of disability.</span>
      <span className={helperClass}>
        Only share what&apos;s relevant to triaging your enquiry.
      </span>
      <textarea
        rows={3}
        value={draft.natureOfDisability ?? ''}
        onChange={(e) => onChange({ natureOfDisability: e.target.value })}
        className={inputClass}
      />
    </label>
  )
}

function RelationshipField({
  draft,
  onChange,
  options,
  labelText,
}: Props & {
  options: ReadonlyArray<(typeof RELATIONSHIPS)[number]>
  labelText: string
}) {
  return (
    <label className={labelClass}>
      <span className={labelTextClass}>{labelText}</span>
      <select
        value={draft.relationshipToParticipant ?? ''}
        onChange={(e) =>
          onChange({
            relationshipToParticipant: e.target.value as (typeof RELATIONSHIPS)[number],
          })
        }
        className={inputClass}
      >
        <option value="">Please choose…</option>
        {options.map((r) => (
          <option key={r} value={r}>
            {RELATIONSHIP_LABELS[r]}
          </option>
        ))}
      </select>
    </label>
  )
}

function SectionDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 mt-2">
      <span className="eyebrow text-cc-fg-muted">{label}</span>
      <span className="flex-1 border-t border-cc-black/20" />
    </div>
  )
}

export function EnquiryStep2({ draft, onChange }: Props) {
  if (draft.audience === 'client') {
    if (draft.enquiringFor === 'other') {
      return (
        <fieldset className="flex flex-col gap-4">
          <legend className="text-2xl font-bold leading-tight mb-2">
            About the person you support.
          </legend>
          <ParticipantNameField draft={draft} onChange={onChange} />
          <RelationshipField
            draft={draft}
            onChange={onChange}
            options={FAMILY_RELATIONSHIPS}
            labelText="Your relationship to them."
          />
          <NatureOfDisabilityField draft={draft} onChange={onChange} />

          <SectionDivider label="Support" />
          <ServiceInterestsField draft={draft} onChange={onChange} />
          <PostcodeField draft={draft} onChange={onChange} />
          <FundingPlanField draft={draft} onChange={onChange} />
          <SupportNeedsField draft={draft} onChange={onChange} />
        </fieldset>
      )
    }

    // Client + Self (also covers the unlikely case enquiringFor is null)
    return (
      <fieldset className="flex flex-col gap-4">
        <legend className="text-2xl font-bold leading-tight mb-2">About your enquiry.</legend>
        <ServiceInterestsField draft={draft} onChange={onChange} />
        <PostcodeField draft={draft} onChange={onChange} />
        <FundingPlanField draft={draft} onChange={onChange} />
        <SupportNeedsField draft={draft} onChange={onChange} />
      </fieldset>
    )
  }

  if (draft.audience === 'referrer') {
    return (
      <fieldset className="flex flex-col gap-4">
        <legend className="text-2xl font-bold leading-tight mb-2">About your enquiry.</legend>

        <SectionDivider label="You" />
        <label className={labelClass}>
          <span className={labelTextClass}>Organisation.</span>
          <input
            type="text"
            value={draft.organisation ?? ''}
            onChange={(e) => onChange({ organisation: e.target.value })}
            className={inputClass}
          />
        </label>
        <RelationshipField
          draft={draft}
          onChange={onChange}
          options={PROFESSIONAL_RELATIONSHIPS}
          labelText="Your role."
        />

        <SectionDivider label="The participant" />
        <ParticipantNameField draft={draft} onChange={onChange} showConsentNote />
        <NatureOfDisabilityField draft={draft} onChange={onChange} />
        <PostcodeField draft={draft} onChange={onChange} />
        <FundingPlanField draft={draft} onChange={onChange} />

        <SectionDivider label="Support" />
        <ServiceInterestsField draft={draft} onChange={onChange} />
        <SupportNeedsField draft={draft} onChange={onChange} />
      </fieldset>
    )
  }

  // career
  return (
    <fieldset className="flex flex-col gap-4">
      <legend className="text-2xl font-bold leading-tight mb-2">About your enquiry.</legend>
      <label className={labelClass}>
        <span className={labelTextClass}>What kind of role?</span>
        <input
          type="text"
          value={draft.careerRoleInterest ?? ''}
          onChange={(e) => onChange({ careerRoleInterest: e.target.value })}
          className={inputClass}
          placeholder="e.g. Support Worker, Team Leader, Clinical"
        />
      </label>
      <label className={labelClass}>
        <span className={labelTextClass}>Location preference.</span>
        <input
          type="text"
          value={draft.careerLocation ?? ''}
          onChange={(e) => onChange({ careerLocation: e.target.value })}
          className={inputClass}
          placeholder="Suburb or region"
        />
      </label>
      <label className={labelClass}>
        <span className={labelTextClass}>Employment type.</span>
        <select
          value={draft.employmentType ?? ''}
          onChange={(e) =>
            onChange({
              employmentType: e.target.value as (typeof EMPLOYMENT_TYPES)[number],
            })
          }
          className={inputClass}
        >
          <option value="">Please choose…</option>
          {EMPLOYMENT_TYPES.map((t) => (
            <option key={t} value={t}>
              {EMPLOYMENT_TYPE_LABELS[t]}
            </option>
          ))}
        </select>
      </label>
    </fieldset>
  )
}

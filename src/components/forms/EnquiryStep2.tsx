'use client'

import type { EnquiryDraft } from './EnquiryForm'
import {
  CLIENT_RELATIONSHIPS,
  EMPLOYMENT_TYPES,
  NDIS_STATUS,
  REFERRER_ROLES,
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

const SERVICE_INTEREST_LABELS: Record<(typeof SERVICE_INTERESTS)[number], string> = {
  sil: 'Supported Independent Living (SIL)',
  sda: 'Specialist Disability Accommodation (SDA)',
  'complex-care': 'Complex Care',
  'community-access': 'Community Access',
  respite: 'Respite',
  pbs: 'Positive Behaviour Support',
  'allied-health': 'Allied Health',
  other: 'Other',
}

const CLIENT_RELATIONSHIP_LABELS: Record<(typeof CLIENT_RELATIONSHIPS)[number], string> = {
  parent: 'Parent',
  sibling: 'Sibling',
  spouse: 'Spouse / partner',
  child: 'Child',
  'other-family': 'Other family member',
  friend: 'Friend',
  carer: 'Carer / Support worker',
  other: 'Other',
}

const REFERRER_ROLE_LABELS: Record<(typeof REFERRER_ROLES)[number], string> = {
  'support-coordinator': 'Support Coordinator',
  'specialist-support-coordinator': 'Specialist Support Coordinator',
  'case-manager': 'Case Manager',
  'allied-health': 'Allied Health Professional',
  hospital: 'Hospital',
  lac: 'LAC (Local Area Coordinator)',
  'social-worker': 'Social Worker',
  'behaviour-support': 'Behaviour Support Practitioner',
  'disability-liaison': 'Disability Liaison Officer',
  other: 'Other',
}

const EMPLOYMENT_TYPE_LABELS: Record<(typeof EMPLOYMENT_TYPES)[number], string> = {
  'full-time': 'Full-time',
  'part-time': 'Part-time',
  casual: 'Casual',
  contract: 'Contract',
  open: 'Open to anything',
}

const NDIS_STATUS_LABELS: Record<(typeof NDIS_STATUS)[number], string> = {
  yes: 'Yes',
  no: 'No',
  unsure: 'Unsure',
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
          const id = `service-${key}`
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

function NdisField({ draft, onChange }: Props) {
  return (
    <label className={labelClass}>
      <span className={labelTextClass}>Is there a current NDIS plan?</span>
      <select
        value={draft.ndisPlan ?? 'unsure'}
        onChange={(e) =>
          onChange({ ndisPlan: e.target.value as (typeof NDIS_STATUS)[number] })
        }
        className={inputClass}
      >
        {NDIS_STATUS.map((s) => (
          <option key={s} value={s}>
            {NDIS_STATUS_LABELS[s]}
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
          <label className={labelClass}>
            <span className={labelTextClass}>Your relationship to them.</span>
            <select
              value={draft.clientRelationship ?? ''}
              onChange={(e) =>
                onChange({
                  clientRelationship: e.target.value as (typeof CLIENT_RELATIONSHIPS)[number],
                })
              }
              className={inputClass}
            >
              <option value="">Please choose…</option>
              {CLIENT_RELATIONSHIPS.map((r) => (
                <option key={r} value={r}>
                  {CLIENT_RELATIONSHIP_LABELS[r]}
                </option>
              ))}
            </select>
          </label>
          <NatureOfDisabilityField draft={draft} onChange={onChange} />

          <SectionDivider label="Support" />
          <ServiceInterestsField draft={draft} onChange={onChange} />
          <PostcodeField draft={draft} onChange={onChange} />
          <NdisField draft={draft} onChange={onChange} />
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
        <NdisField draft={draft} onChange={onChange} />
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
        <label className={labelClass}>
          <span className={labelTextClass}>Your role.</span>
          <select
            value={draft.referrerRole ?? ''}
            onChange={(e) =>
              onChange({ referrerRole: e.target.value as (typeof REFERRER_ROLES)[number] })
            }
            className={inputClass}
          >
            <option value="">Please choose…</option>
            {REFERRER_ROLES.map((r) => (
              <option key={r} value={r}>
                {REFERRER_ROLE_LABELS[r]}
              </option>
            ))}
          </select>
        </label>

        <SectionDivider label="The participant" />
        <ParticipantNameField draft={draft} onChange={onChange} showConsentNote />
        <NatureOfDisabilityField draft={draft} onChange={onChange} />
        <PostcodeField draft={draft} onChange={onChange} />
        <NdisField draft={draft} onChange={onChange} />

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

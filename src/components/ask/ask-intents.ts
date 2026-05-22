/**
 * Ask CareChoice — intent router.
 *
 * Pure logic. Takes a user message + context (current time, demo-override flag) and
 * returns a structured AskResponse. The UI layer (AskCC.tsx) consumes this and renders
 * conversation bubbles + source-link cards + (for `homes` intent) fetched SDA cards.
 *
 * No real Agentforce backend exists yet — this is a polished scripted mock branded
 * "Powered by Agentforce" for the tech-partner story.
 */

export type Intent = 'service' | 'homes' | 'transfer-human' | 'enquiry' | 'unknown'

export interface AskSourceLink {
  label: string
  href: string
  description?: string
}

export interface AskResponse {
  intent: Intent
  text: string
  sourceLinks?: AskSourceLink[]
  /** Signals to the UI that it should fetch live SDA vacancies. Region is optional. */
  homeLookup?: { region?: string; minBeds?: number }
  followUpChips?: string[]
}

export interface IntentContext {
  now: Date
  demoAfterHours: boolean
}

// -----------------------------------------------------------------------------
// Business-hours helper
// -----------------------------------------------------------------------------

/**
 * Returns true when the given Date falls within 9am–5pm Mon-Fri Australia/Melbourne.
 * Pure function — no `new Date()` inside. Uses Intl to project the input instant
 * into Melbourne local time, then evaluates the weekday + hour.
 */
export function isBusinessHours(now: Date): boolean {
  const fmt = new Intl.DateTimeFormat('en-AU', {
    timeZone: 'Australia/Melbourne',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
  const parts = fmt.formatToParts(now)
  const weekday = parts.find((p) => p.type === 'weekday')?.value ?? ''
  const hourStr = parts.find((p) => p.type === 'hour')?.value ?? '0'
  const minuteStr = parts.find((p) => p.type === 'minute')?.value ?? '0'
  // Intl en-AU returns hour as '00'–'23' under hour12:false (but treats midnight specially
  // on some engines — normalise '24' to '0').
  let hour = parseInt(hourStr, 10)
  if (hour === 24) hour = 0
  const minute = parseInt(minuteStr, 10)

  const weekdayMap: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  }
  const dayNum = weekdayMap[weekday] ?? -1
  if (dayNum < 1 || dayNum > 5) return false

  // 9:00 inclusive → 17:00 exclusive
  const totalMin = hour * 60 + minute
  return totalMin >= 9 * 60 && totalMin < 17 * 60
}

// -----------------------------------------------------------------------------
// Service catalogue — slug + matchers + short description
// -----------------------------------------------------------------------------

interface ServiceDef {
  slug: string
  title: string
  description: string
  /** Regex tested against the lower-cased message. */
  matcher: RegExp
  /** Conversational answer (2–3 sentences). */
  blurb: string
  /** Extra source links to surface (in addition to /services/<slug>). */
  extraLinks?: AskSourceLink[]
}

const SERVICES: ServiceDef[] = [
  {
    slug: 'supported-independent-living',
    title: 'Supported Independent Living (SIL)',
    description: 'Help to live as independently as possible in a shared home or your own.',
    matcher: /\b(sil|supported independent living)\b/i,
    blurb:
      "Supported Independent Living, or SIL, is help to live as independently as possible — in your own home or one of our shared homes. It's funded through your NDIS plan under Assistance with Daily Life. Our team supports daily routines, personal care, and community life.",
  },
  {
    slug: 'specialist-disability-housing', // will resolve to /find-a-home in source links
    title: 'Specialist Disability Accommodation (SDA)',
    description: 'Purpose-built homes for people with extreme functional impairment or very high support needs.',
    matcher: /\b(sda|specialist disability accommodation|specialist disability housing|housing)\b/i,
    blurb:
      "Specialist Disability Accommodation (SDA) is purpose-built housing for people with extreme functional impairment or very high support needs. CareChoice operates 18 SDA homes across Victoria — Improved Liveability, Fully Accessible, and Robust design categories. Browse our current vacancies by region and design standard.",
    // We do NOT have a dedicated /services/specialist-disability-housing page; fall back
    // to /find-a-home for SDA-shaped questions.
  },
  {
    slug: 'complex-care',
    title: 'Complex care.',
    description: '24/7 person-centred services for individuals with complex needs.',
    matcher: /\b(complex care|24\s?\/?\s?7|24 hour|complex needs)\b/i,
    blurb:
      "Our Complex Care offer is 24/7 person-centred support for individuals with high or complex needs — including PEG feeding, tracheostomy care, seizure management, and behaviour support. A multidisciplinary team led by registered nurses works with the participant, their family, and clinicians.",
  },
  {
    slug: 'positive-behaviour-support',
    title: 'Positive Behaviour Support (PBS).',
    description: 'Evidence-based behaviour support delivered by NDIS Commission-registered practitioners.',
    matcher: /\b(pbs|positive behaviour support|behaviour support|behaviour)\b/i,
    blurb:
      "Positive Behaviour Support (PBS) is an evidence-based approach to reducing behaviours of concern and improving quality of life. Our NDIS Commission-registered practitioners work alongside the participant, their family, and support team to build skills and adjust environments.",
  },
  {
    slug: 'rapid-hospital-discharge',
    title: 'Rapid hospital discharge.',
    description: 'Coordinated discharge support to get participants safely home faster.',
    matcher: /\b(rapid hospital discharge|hospital discharge|discharge)\b/i,
    blurb:
      "Our Rapid Hospital Discharge service coordinates a safe, fast transition from hospital back to home. We work with hospital social work teams, NDIA delegates, and clinicians to set up supports, equipment, and modifications within days — not weeks.",
  },
  {
    slug: 'home-nursing-disability-support',
    title: 'Home nursing & disability support.',
    description: 'Registered-nurse-led clinical care delivered in your own home.',
    matcher: /\b(home nursing|nursing|nurse|clinical care)\b/i,
    blurb:
      "Our Home Nursing service brings registered-nurse-led clinical care into your home — wound care, medication management, PEG and tracheostomy support, and post-operative recovery. Delivered by our employed nursing team, not contractors.",
  },
  {
    slug: 'community-access',
    title: 'Community access.',
    description: 'Supports to participate in community life — social, recreational, vocational.',
    matcher: /\b(community access|community engagement|community participation)\b/i,
    blurb:
      "Community Access supports you to participate in community life — social activities, recreation, learning, and vocational programs. Our support workers help you build connections, try new things, and pursue what matters to you.",
  },
  {
    slug: 'respite',
    title: 'Respite.',
    description: 'Short-term accommodation and supports for participants and their primary carers.',
    matcher: /\brespite\b/i,
    blurb:
      "Respite (Short Term Accommodation) gives you a break — in one of our homes or yours — and gives your primary carer time to rest. Stays are typically 1–14 nights and funded through your NDIS plan.",
  },
  {
    slug: 'custodial-community-re-entry',
    title: 'Custodial & community re-entry.',
    description: 'Specialist transitional supports for participants leaving custodial settings.',
    matcher: /\b(custodial|re-entry|reentry|forensic|prison)\b/i,
    blurb:
      "Our Custodial & Community Re-entry service supports people with disability transitioning out of custodial settings. We coordinate housing, support, and clinical services to enable a safe and stable re-entry to community life.",
  },
  {
    slug: 'tac-worksafe-support',
    title: 'TAC & WorkSafe support.',
    description: 'Supports for participants funded through the Transport Accident Commission or WorkSafe Victoria.',
    matcher: /\b(tac|worksafe|transport accident)\b/i,
    blurb:
      "Yes — CareChoice supports TAC and WorkSafe participants alongside NDIS. The funding pathways differ but the same care team and homes are available. Our intake coordinators can guide you through the approval steps.",
  },
]

// -----------------------------------------------------------------------------
// Region recognition for `homes` intent
// -----------------------------------------------------------------------------

const REGION_PATTERNS: Array<{ label: string; regex: RegExp }> = [
  { label: 'Geelong', regex: /\bgeelong\b/i },
  { label: 'Bendigo', regex: /\bbendigo\b/i },
  { label: 'Ballarat', regex: /\bballarat\b/i },
  { label: 'Melbourne', regex: /\bmelbourne\b/i },
  { label: 'Inner Melbourne', regex: /\binner melbourne\b/i },
  { label: 'Western', regex: /\bwestern (suburbs|region)?\b/i },
  { label: 'Northern', regex: /\bnorthern (suburbs|region)?\b/i },
  { label: 'Eastern', regex: /\beastern (suburbs|region)?\b/i },
  { label: 'South Eastern', regex: /\bsouth ?eastern\b/i },
  { label: 'Gippsland', regex: /\bgippsland\b/i },
  { label: 'Latrobe', regex: /\blatrobe\b/i },
  { label: 'Hume', regex: /\bhume\b/i },
  { label: 'Goulburn', regex: /\bgoulburn\b/i },
  { label: 'Grampians', regex: /\bgrampians\b/i },
]

function detectRegion(message: string): string | undefined {
  for (const r of REGION_PATTERNS) {
    if (r.regex.test(message)) return r.label
  }
  return undefined
}

// -----------------------------------------------------------------------------
// Intent matchers
// -----------------------------------------------------------------------------

const TRANSFER_HUMAN_REGEX =
  /\b(talk to|speak to|chat with|human|agent|person|staff|coordinator|someone|team member)\b/i

const ENQUIRY_REGEX =
  /\b(enquir(?:y|ies|e)|contact|get in touch|email me|email us|phone|call(?: you)?|1300)\b/i

// "homes" plural OR strong-signal vacancy / availability phrases. We deliberately exclude
// singular "home" to avoid false positives like "home nursing".
const HOMES_REGEX =
  /\b(homes|available\b.*\b(?:sil|sda|home|housing|now|vacanc)|vacanc(?:y|ies)|find a home|sda home|sil home|where can i live|move in|live with you|show me homes)\b/i

const SERVICES_LIST_REGEX = /\b(what (services|do you) (do|offer)|services do you offer|what (?:do )?you do)\b/i

const SERVICE_FOLLOW_UPS = [
  'Show me available SIL homes',
  'Make an enquiry',
  'Talk to a human',
]

const UNKNOWN_FOLLOW_UPS = [
  'Show me SIL homes',
  'What services do you offer?',
  'Make an enquiry',
]

// -----------------------------------------------------------------------------
// Route a message → AskResponse
// -----------------------------------------------------------------------------

export function routeIntent(message: string, ctx: IntentContext): AskResponse {
  const msg = message.trim()
  if (!msg) return unknownResponse()

  // 1. transfer-human (check first so "talk to a coordinator about SDA" routes to human)
  if (TRANSFER_HUMAN_REGEX.test(msg)) {
    return transferHumanResponse(ctx)
  }

  // 2. enquiry — explicit enquire/contact/phone queries
  if (ENQUIRY_REGEX.test(msg)) {
    return enquiryResponse()
  }

  // 3. Generic "what services do you offer"
  if (SERVICES_LIST_REGEX.test(msg)) {
    return genericServicesResponse()
  }

  // 4. homes — strong-signal homes/vacancies queries (HOMES_REGEX excludes singular "home"
  //    so "home nursing" continues to step 5)
  if (HOMES_REGEX.test(msg)) {
    return homesResponse(msg)
  }

  // 5. Match against specific service
  for (const svc of SERVICES) {
    if (svc.matcher.test(msg)) {
      return serviceResponse(svc)
    }
  }

  return unknownResponse()
}

// -----------------------------------------------------------------------------
// Response builders
// -----------------------------------------------------------------------------

function serviceResponse(svc: ServiceDef): AskResponse {
  const links: AskSourceLink[] = []

  // For SDA / housing — point at /find-a-home rather than a non-existent services page
  if (svc.slug === 'specialist-disability-housing') {
    links.push({
      label: 'Browse available SDA homes',
      href: '/find-a-home',
      description: 'Filter by region, design standard, and availability.',
    })
  } else {
    links.push({
      label: svc.title,
      href: `/services/${svc.slug}`,
      description: svc.description,
    })
  }

  if (svc.extraLinks) links.push(...svc.extraLinks)

  return {
    intent: 'service',
    text: svc.blurb,
    sourceLinks: links,
    followUpChips: SERVICE_FOLLOW_UPS,
  }
}

function genericServicesResponse(): AskResponse {
  // List the top services
  const featured = [
    'supported-independent-living',
    'specialist-disability-housing',
    'complex-care',
    'positive-behaviour-support',
  ]
  const links: AskSourceLink[] = []
  for (const slug of featured) {
    const svc = SERVICES.find((s) => s.slug === slug)
    if (!svc) continue
    if (svc.slug === 'specialist-disability-housing') {
      links.push({
        label: 'Specialist Disability Accommodation (SDA).',
        href: '/find-a-home',
        description: svc.description,
      })
    } else {
      links.push({
        label: svc.title,
        href: `/services/${svc.slug}`,
        description: svc.description,
      })
    }
  }
  return {
    intent: 'service',
    text:
      "We offer a full range of disability supports across Victoria — Supported Independent Living, Specialist Disability Accommodation, Complex Care, Positive Behaviour Support, and more. Here are the most-asked-about ones to start with.",
    sourceLinks: links,
    followUpChips: SERVICE_FOLLOW_UPS,
  }
}

function homesResponse(message: string): AskResponse {
  const region = detectRegion(message)
  const text = region
    ? `I can show you our available SDA homes. Here are homes in ${region}.`
    : 'I can show you our available SDA homes. Here are the top three right now.'

  return {
    intent: 'homes',
    text,
    homeLookup: region ? { region } : {},
    sourceLinks: [
      {
        label: 'Browse all homes',
        href: '/find-a-home',
        description: 'Filter by region, design standard, and availability.',
      },
    ],
    followUpChips: ['What is SIL?', 'Talk to a human', 'Make an enquiry'],
  }
}

function transferHumanResponse(ctx: IntentContext): AskResponse {
  const inHours = !ctx.demoAfterHours && isBusinessHours(ctx.now)
  if (inHours) {
    return {
      intent: 'transfer-human',
      text:
        "Connecting you to a team member. Please hold on — average wait is under two minutes.",
      followUpChips: ['Tell me about SIL', 'Find a home', 'Make an enquiry'],
    }
  }
  return {
    intent: 'transfer-human',
    text:
      "Our team is offline outside 9am–5pm Mon–Fri Melbourne time. Would you like to make an enquiry instead? We'll get back to you within one business day.",
    sourceLinks: [
      {
        label: 'Make an enquiry',
        href: '/enquiry',
        description: "Quick 3-step form. We respond within one business day.",
      },
    ],
    followUpChips: ['Tell me about SIL', 'Find a home'],
  }
}

function enquiryResponse(): AskResponse {
  return {
    intent: 'enquiry',
    text:
      "You can make an enquiry online — we'll get back to you within one business day. Or call us on 1300 737 942 during business hours.",
    sourceLinks: [
      {
        label: 'Make an online enquiry',
        href: '/enquiry',
        description: 'Quick 3-step form with a response within one business day.',
      },
    ],
    followUpChips: ['Tell me about SIL', 'Show me homes', 'Talk to a human'],
  }
}

function unknownResponse(): AskResponse {
  return {
    intent: 'unknown',
    text:
      "I can help you with finding a home, learning about our services, talking to our team, or starting an enquiry. What's the most useful place to start?",
    sourceLinks: [
      {
        label: 'Browse all CareChoice content',
        href: '/search',
        description: 'Search services, case studies, and news.',
      },
    ],
    followUpChips: UNKNOWN_FOLLOW_UPS,
  }
}

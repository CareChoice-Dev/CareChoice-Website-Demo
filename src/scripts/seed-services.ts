/**
 * Seed the Services collection with 6 Disability Service entries.
 *
 * Usage: npm run seed:services
 *
 * Idempotent: if a Service with the same slug exists, the script skips it.
 * Safe to re-run.
 *
 * Copy is sourced from docs/content-extraction-services.md (Plan 6 Task 1).
 */

import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })
dotenv.config()

import { getPayload } from 'payload'

type FundingType = 'ndis' | 'tac' | 'worksafe' | 'private'
type ServiceCategory = 'disability-services' | 'complex-care' | 'specialist-services' | 'housing'

interface FaqEntry {
  question: string
  answer: string
}

interface ServiceSeed {
  slug: string
  title: string
  category: ServiceCategory
  fundingTypes: FundingType[]
  intro: string
  whoThisIsFor: string[]
  whatsIncluded: string[]
  eligibility: string
  faq: FaqEntry[]
}

const SERVICES: ServiceSeed[] = [
  {
    slug: 'rapid-hospital-discharge',
    title: 'Rapid Hospital Discharge.',
    category: 'disability-services',
    fundingTypes: ['ndis'],
    intro:
      "When someone with disability is clinically ready to leave hospital but doesn't have the right home to return to, the delay can stretch for weeks. We work with hospitals, families, and discharge coordinators to move quickly — into Medium Term Accommodation while a permanent home is found, with the support workers and clinical oversight already in place from day one.",
    whoThisIsFor: [
      'People with disability who are clinically ready for hospital discharge.',
      'NDIS participants whose plan covers Specialist Disability Accommodation or Medium Term Accommodation.',
      'Families and hospital discharge teams looking for a coordinated handover, not a referral list.',
      "People who'll need a permanent home — and a team that can be in place from the first night.",
    ],
    whatsIncluded: [
      'Discharge and community transition management — we coordinate with the ward, the social worker, and the NDIS planner.',
      'Medium Term Accommodation with trained support workers, ready before the discharge date.',
      '24-hour support coordination during the transition window.',
      'A person-centred support plan built around your goals — not a template.',
      'A direct line into CareChoice Homes so a permanent SDA placement is in the works from week one.',
      'Allied health team partnerships so the plan we build aligns with your existing NDIS supports.',
    ],
    eligibility:
      "CareChoice is a registered NDIS provider. We're also registered with TAC and WorkSafe for clients whose post-hospital recovery is funded through those schemes. Funding covers both the accommodation and the support hours.",
    faq: [
      {
        question: 'How fast can you mobilise?',
        answer:
          'We\'ve moved people from "discharge cleared" to "in a bed with support staff on shift" inside 72 hours. Faster if the planning starts before the discharge date is locked in.',
      },
      {
        question: "What if there's no SDA home available yet?",
        answer:
          "That's the point of Medium Term Accommodation — a safe, supported home for up to 90 days while the permanent home is sourced. Most clients move into a CareChoice SDA home from there.",
      },
    ],
  },
  {
    slug: 'home-nursing-disability-support',
    title: 'Home Nursing & Disability Support.',
    category: 'disability-services',
    fundingTypes: ['ndis', 'tac', 'worksafe'],
    intro:
      'For people with complex medical needs, the right care at home is the difference between a hospital admission and a normal week. We build bespoke nursing programs that bring registered nurses, enrolled nurses, and trained support workers into your home — coordinated by a registered nurse who oversees the day-to-day and stays on call after hours.',
    whoThisIsFor: [
      'People living at home with Type 1 or Type 2 diabetes.',
      'People with acquired brain injury, cerebral palsy, or intellectual disability.',
      'People living with dementia or younger-onset Alzheimer\'s disease.',
      'People living with motor neurone disease.',
      'People requiring complex seizure management.',
      "People who are non-verbal — our staff escort and advocate during hospital visits so they're never going in alone.",
    ],
    whatsIncluded: [
      'Medication administration and oversight.',
      'Diabetes management — including insulin and glucose monitoring.',
      'Complex wound and pressure-injury management.',
      'Complex pain management.',
      'Catheter, stoma, and PEG-feeding care.',
      'Injections, oxygen changes, and vital-sign monitoring.',
      'Health treatment plan administration.',
      'Pharmacy and allied health liaison.',
      'Falls prevention.',
      'One hour of registered-nurse oversight every day, with after-hours availability.',
    ],
    eligibility:
      "We're registered with the NDIS, TAC, and WorkSafe. Most clients fund this support through their NDIS Core Supports — Assistance with Daily Life line, with a separate allocation for clinical nursing where the plan provides it.",
    faq: [
      {
        question: 'Do I get the same nurse each visit?',
        answer:
          "We work hard to keep your team consistent. Continuity matters — especially for complex care — and we'd rather invest in the right hire than send a roster of strangers.",
      },
      {
        question: 'What happens if something changes overnight?',
        answer:
          'The registered nurse on your program is reachable after hours. For genuine emergencies we work with the ambulance service and your specialists; for everything else, a phone call usually does it.',
      },
    ],
  },
  {
    slug: 'community-access',
    title: 'Community Access.',
    category: 'disability-services',
    fundingTypes: ['ndis', 'tac', 'worksafe'],
    intro:
      "A good week isn't just about being supported at home — it's about getting out, seeing people, and doing the things you love. Community Access pairs you with a support worker who comes along so the sport, the class, the catch-up, or the day at the beach actually happens.",
    whoThisIsFor: [
      'People who want to participate in social, sporting, or cultural activities and need a hand to do so.',
      'People building confidence and connection in their local community.',
      'Anyone whose NDIS, TAC, or WorkSafe plan funds capacity-building or core supports for community participation.',
    ],
    whatsIncluded: [
      'Days out — parks, beaches, lakes, country drives.',
      'Sport — bowling, golf, swimming, gym sessions.',
      'Entertainment — movies, shopping, concerts, footy.',
      'Friends and family — catch-ups, meals, visits.',
      'Community and religious events.',
      "Classes — art, drama, music, language, whatever's on.",
    ],
    eligibility:
      "We're registered with the NDIS, TAC, and WorkSafe.\n\nA note on transport: NDIS funding generally won't cover the cost of getting somewhere from your Core Supports, but there are a few pathways — self-managed transport allocations, agency-managed allocations, the Multi Purpose Taxi Program for Victorian residents with permanent disability, or the Mobility Allowance for people 16 and over who meet the criteria. We can talk you through which one fits.",
    faq: [
      {
        question: 'How much notice do I need to give?',
        answer:
          "For regular outings, the schedule's set at the start of each month. One-off requests we accommodate where staffing allows — usually a few days' notice is plenty.",
      },
      {
        question: 'Can a family member come along?',
        answer:
          'Yes. The support worker is there to support you — your friends and family being there alongside is part of what makes a good day.',
      },
    ],
  },
  {
    slug: 'respite',
    title: 'Respite Support.',
    category: 'disability-services',
    fundingTypes: ['ndis', 'tac', 'worksafe'],
    intro:
      'Carers need a break. Not as a luxury — as the thing that lets them keep caring. We deliver respite support in the home, on flexible terms: a few hours here and there, a regular weekly block, an overnight, or full 24-hour cover when something comes up. No waiting lists.',
    whoThisIsFor: [
      'Family members and friends caring for someone with significant or permanent care needs at home.',
      'Carers who need scheduled breaks to work, attend appointments, or simply rest.',
      'Carers facing emergencies — illness, family business, or an unexpected gap in supports.',
    ],
    whatsIncluded: [
      'Weekday, weekend, and evening cover.',
      'Overnight and 24-hour respite.',
      'Holiday-period cover.',
      'Support workers matched to the person being cared for — their needs, their routine, their preferences.',
      'A four-hour minimum booking, then as flexible as the week needs to be.',
      'Service across Melbourne, Geelong, Ballarat, Bendigo, the Mornington Peninsula, and the Latrobe Valley.',
    ],
    eligibility:
      "We're registered with the NDIS, TAC, and WorkSafe. Most respite is funded under the carer's or the participant's NDIS plan, but if the funding picture is unclear, ask us — we'd rather help work it out than turn you away.",
    faq: [
      {
        question: 'How fast can you start?',
        answer:
          'For non-emergency respite, usually within a week. For emergencies, we move as fast as the staffing allows — often inside 24 hours.',
      },
      {
        question: 'Will it be the same worker each time?',
        answer:
          "For regular weekly respite, yes — the same person whenever we can. For one-off cover, we'll match the closest fit and brief them properly before they arrive.",
      },
    ],
  },
  {
    slug: 'custodial-community-re-entry',
    title: 'Custodial & Community Re-Entry.',
    category: 'disability-services',
    fundingTypes: ['ndis'],
    intro:
      "Leaving a forensic or correctional setting and returning to the community is a high-stakes transition. People with complex needs deserve a team that's done it before — and that can hold the support steady through the first weeks, the first year, and beyond.",
    whoThisIsFor: [
      'People with disability transitioning from forensic, custodial, or correctional settings.',
      'People with complex care needs and behaviour support requirements alongside the re-entry process.',
      'Case managers, complex-care teams, and forensic service providers looking for an experienced community partner.',
    ],
    whatsIncluded: [
      'Support plans built around the individual — designed with the case manager and complex care team.',
      'Staff trained in behaviour management specific to forensic re-entry.',
      'In-home, residential, and community support — chosen to fit the person, not slotted into a fixed programme.',
      'Capacity-building for therapeutic engagement.',
      'Partnership coordination with forensic service providers, the NDIS, and clinical specialists.',
    ],
    eligibility:
      'CareChoice is a registered NDIS provider. We work in partnership with NDISDA, NDS, and the Australasian Association of Forensic Disability.',
    faq: [
      {
        question: 'Do your staff have specific training for this work?',
        answer:
          'Yes. Behaviour management, trauma-informed practice, and the specifics of forensic re-entry are part of the onboarding — and refreshed throughout the placement.',
      },
      {
        question: 'How long does the support continue?',
        answer:
          'As long as it needs to. Many of our re-entry clients become long-term residents in CareChoice homes; others step into independent living as the plan progresses.',
      },
    ],
  },
  {
    slug: 'tac-worksafe-support',
    title: 'TAC & WorkSafe Support.',
    category: 'disability-services',
    fundingTypes: ['tac', 'worksafe'],
    intro:
      'Recovering from a transport accident or a serious workplace injury is a long road, and the support needs to keep up with how recovery actually goes — not how it looks on a plan. As a registered TAC and WorkSafe provider, we deliver attendant care, in-home support, and 24-hour care that flexes as the recovery does.',
    whoThisIsFor: [
      'People recovering from transport accident injuries funded through the TAC.',
      'People recovering from workplace injuries funded through WorkSafe Victoria.',
      'Clients transitioning out of hospital or rehabilitation back to home.',
      'Anyone whose recovery needs attendant care, allied health coordination, or 24-hour cover.',
    ],
    whatsIncluded: [
      'Post-acute and attendant care — personal care, bed transfers, mobility support.',
      'Home help — housework, laundry, cleaning, meal preparation under the TAC home-services line.',
      'Skill-building support for independence, community engagement, and return-to-work goals.',
      '24-hour care for round-the-clock needs.',
      'Hospital and rehabilitation exit support — coordinated with the discharge team.',
      'Goal-orientated recovery planning, with progress reviewed on a regular cadence.',
      'AHPRA-registered nurses and allied health professionals on the team.',
    ],
    eligibility:
      "We're registered with the TAC, WorkSafe, and the NDIS. For TAC and WorkSafe clients we operate under the schemes' practice standards and code of conduct — and rates are set by the scheme, not by us.",
    faq: [
      {
        question: 'Do you coordinate with my existing specialists?',
        answer:
          "Yes. Most recovery plans involve a treating doctor, allied health, sometimes a return-to-work coordinator. We work alongside them — we're not trying to replace your existing team, just add the on-the-ground support that lets the plan run.",
      },
      {
        question: 'How is progress reviewed?',
        answer:
          'A dedicated team leader oversees complex-care programs and runs a regular review with you, your funding coordinator, and your specialists. Small gains build the motivation that keeps the recovery going.',
      },
    ],
  },
]

async function main() {
  const { default: config } = await import('../payload.config')
  const payload = await getPayload({ config })

  let created = 0
  let skipped = 0

  for (const s of SERVICES) {
    const existing = await payload.find({
      collection: 'services',
      where: { slug: { equals: s.slug } },
      limit: 1,
    })
    if (existing.docs.length > 0) {
      console.log(`Exists, skipping: ${s.slug}`)
      skipped++
      continue
    }

    const data = {
      title: s.title,
      slug: s.slug,
      category: s.category,
      fundingTypes: s.fundingTypes,
      intro: s.intro,
      whoThisIsFor: s.whoThisIsFor.map((point) => ({ point })),
      whatsIncluded: s.whatsIncluded.map((point) => ({ point })),
      eligibility: s.eligibility,
      faq: s.faq,
    }

    await payload.create({
      collection: 'services',
      locale: 'en',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: data as any,
    })

    console.log(`Created: ${s.slug}`)
    created++
  }

  console.log()
  console.log(`Done. Created: ${created}, skipped (already existed): ${skipped}.`)
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})

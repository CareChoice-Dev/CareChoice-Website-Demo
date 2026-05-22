/**
 * Seed the Navigation global with the nested dropdown structure that
 * mirrors carechoice.com.au.
 *
 * Usage: npm run seed:navigation
 *
 * This OVERWRITES the topNav (and footerColumns + acknowledgementOfCountry
 * if they're empty). Safe to re-run: it sets the same structure each time.
 */

import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })
dotenv.config()

import { getPayload } from 'payload'

interface NavChild {
  label: string
  url: string
  description?: string
}

interface NavItem {
  label: string
  url: string
  highlightAsCta?: boolean
  children?: NavChild[]
}

const TOP_NAV: NavItem[] = [
  {
    label: 'Disability Services',
    url: '/services',
    children: [
      { label: 'Who we support', url: '/who-we-support' },
      { label: 'Rapid Hospital Discharge', url: '/services/rapid-hospital-discharge' },
      { label: 'Home Nursing & Disability Support', url: '/services/home-nursing-disability-support' },
      { label: 'Supported Independent Living', url: '/services/supported-independent-living' },
      { label: 'Community Access', url: '/services/community-access' },
      { label: 'Respite Support', url: '/services/respite' },
      { label: 'Custodial & Community Re-Entry', url: '/services/custodial-community-re-entry' },
      { label: 'TAC & WorkSafe Support', url: '/services/tac-worksafe-support' },
    ],
  },
  {
    label: 'CareChoice Homes',
    url: '/find-a-home',
    children: [
      { label: 'SDA Vacancies', url: '/find-a-home' },
    ],
  },
  {
    label: 'Specialist Services',
    url: '/services',
    children: [
      { label: 'Positive Behaviour Support', url: '/services/positive-behaviour-support' },
      { label: 'Complex Care', url: '/services/complex-care' },
    ],
  },
  { label: 'About', url: '/about' },
  { label: 'News', url: '/news' },
  { label: 'Careers', url: '/careers' },
  { label: 'Contact', url: '/contact' },
  { label: 'Make an enquiry.', url: '/enquiry', highlightAsCta: true },
]

async function main() {
  const { default: config } = await import('../payload.config')
  const payload = await getPayload({ config })

  const current = await payload.findGlobal({ slug: 'navigation', locale: 'en' })

  await payload.updateGlobal({
    slug: 'navigation',
    locale: 'en',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: {
      topNav: TOP_NAV as any,
      // preserve existing footer + AoC if set
      footerColumns: (current?.footerColumns as unknown) ?? [],
      acknowledgementOfCountry: (current?.acknowledgementOfCountry as string) ?? '',
    } as any,
  })

  console.log(`Updated Navigation global — topNav has ${TOP_NAV.length} items`)
  console.log(
    `  Dropdowns: ${TOP_NAV.filter((i) => i.children && i.children.length > 0)
      .map((i) => `${i.label} (${i.children!.length} children)`)
      .join(', ')}`,
  )

  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})

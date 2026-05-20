import { getPayload } from 'payload'
import config from '@payload-config'
import { Module } from '@/components/primitives/Module'

export async function ContactStrip() {
  const payload = await getPayload({ config })
  const settings = await payload.findGlobal({ slug: 'site-settings' })

  const phone = (settings?.phoneNumber as string) ?? '1300 737 942'
  const email = (settings?.contactEmail as string) ?? 'enquiries@carechoice.com.au'

  return (
    <Module weight="card" className="px-6 py-4 flex flex-wrap items-center justify-between gap-4 bg-cc-white">
      <div className="flex flex-wrap items-center gap-6 text-base">
        <a href={`tel:${phone.replace(/\s+/g, '')}`} className="font-semibold no-underline hover:underline">
          ☎ {phone}
        </a>
        <a href={`mailto:${email}`} className="font-semibold no-underline hover:underline">
          ✉ {email}
        </a>
        <span className="font-semibold">carechoice.com.au</span>
      </div>
      <div className="flex items-center gap-3 text-sm">
        <a href="https://linkedin.com/company/carechoice" className="font-semibold hover:underline">LinkedIn</a>
        <a href="https://facebook.com/carechoice" className="font-semibold hover:underline">Facebook</a>
      </div>
    </Module>
  )
}

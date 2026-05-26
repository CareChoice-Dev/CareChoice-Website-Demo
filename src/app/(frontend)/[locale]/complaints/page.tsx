import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import { isUrlSlug } from '@/lib/locale'
import { ComplaintForm } from '@/components/forms/ComplaintForm'

export const metadata = {
  title: 'Complaints and feedback — CareChoice.',
  description:
    'How to make a complaint or give feedback to CareChoice, and how to escalate to the NDIS Quality and Safeguards Commission.',
}

export default async function ComplaintsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale: urlLocale } = await params
  if (!isUrlSlug(urlLocale)) notFound()

  const payload = await getPayload({ config })
  const settings = await payload.findGlobal({ slug: 'site-settings' })
  const phone = ((settings?.phoneNumber as string | undefined)?.trim() || '') || '1300 737 942'
  const email =
    ((settings?.contactEmail as string | undefined)?.trim() || '') || 'enquiries@carechoice.com.au'
  const phoneHref = `tel:${phone.replace(/\s+/g, '')}`

  return (
    <div className="max-w-[1280px] mx-auto px-6 md:px-8 py-10 flex flex-col gap-10">
      <header className="flex flex-col gap-3 max-w-3xl">
        <span className="eyebrow">We&apos;re listening.</span>
        <h1 className="text-4xl md:text-6xl font-bold leading-tight tracking-tight">
          Complaints and feedback.
        </h1>
        <p className="text-lg leading-relaxed">
          If something isn&apos;t right, we want to know. Making a complaint will never affect the
          support you receive. You can tell us in whatever way is easiest for you — and you can do
          it anonymously if you&apos;d prefer.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-10">
        <main className="flex flex-col gap-8">
          <section className="flex flex-col gap-3">
            <h2 className="text-2xl font-bold leading-tight">Make a complaint online.</h2>
            <p className="text-base leading-relaxed max-w-2xl">
              Fill in the form below. You only have to share as much as you&apos;re comfortable
              with.
            </p>
            <ComplaintForm phoneNumber={phone} />
          </section>

          <section className="flex flex-col gap-3 border-t-2 border-cc-black pt-6">
            <h2 className="text-2xl font-bold leading-tight">
              If you&apos;re not satisfied with our response.
            </h2>
            <p className="text-base leading-relaxed max-w-2xl">
              You can contact the NDIS Quality and Safeguards Commission at any time — you
              don&apos;t have to come to us first. The Commission is the independent body that
              oversees NDIS providers.
            </p>
            <ul className="flex flex-col gap-1 text-base">
              <li>
                Phone:{' '}
                <a href="tel:1800035544" className="underline font-semibold">
                  1800 035 544
                </a>{' '}
                (free call)
              </li>
              <li>
                Online:{' '}
                <a
                  href="https://www.ndiscommission.gov.au/about/complaints"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline font-semibold"
                >
                  ndiscommission.gov.au/about/complaints
                </a>
              </li>
              <li>TTY: 133 677 · Interpreter: 131 450</li>
            </ul>
          </section>
        </main>

        <aside className="flex flex-col gap-4 h-fit border-2 border-cc-black p-5 bg-cc-surface-pink/40">
          <h2 className="text-xl font-bold leading-tight">Other ways to reach us.</h2>
          <ul className="flex flex-col gap-3 text-sm">
            <li>
              <span className="font-semibold block">Phone</span>
              <a href={phoneHref} className="underline">
                {phone}
              </a>{' '}
              (business hours)
            </li>
            <li>
              <span className="font-semibold block">Email</span>
              <a href={`mailto:${email}`} className="underline break-words">
                {email}
              </a>
            </li>
            <li>
              <span className="font-semibold block">In person</span>
              Tell any CareChoice team member — they&apos;ll help you lodge it.
            </li>
          </ul>
          <p className="text-xs text-cc-fg-muted border-t-2 border-cc-black pt-3">
            Need help? We can complete this form with you over the phone, or you can use the{' '}
            Easy Read version. Interpreters are available on request.
          </p>
        </aside>
      </div>
    </div>
  )
}

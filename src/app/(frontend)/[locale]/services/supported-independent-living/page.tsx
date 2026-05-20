import { notFound } from 'next/navigation'
import { isUrlSlug, urlSlugToLocale } from '@/lib/locale'
import { findOneServiceBySlug } from '@/lib/payload-client'
import { HeadlineBlock } from '@/components/blocks/HeadlineBlock'
import { Section } from '@/components/primitives/Section'
import { Tag } from '@/components/primitives/Tag'
import { FundingTabs } from '@/components/blocks/FundingTabs'
import { KeyPointsBlock } from '@/components/blocks/KeyPointsBlock'
import { StepByStepBlock } from '@/components/blocks/StepByStepBlock'
import { AccordionBlock } from '@/components/blocks/AccordionBlock'
import { CTABlock } from '@/components/blocks/CTABlock'
import { RichText } from '@/components/primitives/RichText'

export default async function SILPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale: urlLocale } = await params
  if (!isUrlSlug(urlLocale)) notFound()
  const locale = urlSlugToLocale(urlLocale)
  const hrefPrefix = `/${urlLocale}`

  const service = await findOneServiceBySlug('supported-independent-living', locale)

  return (
    <div className="max-w-[1280px] mx-auto px-6 md:px-8 py-10 flex flex-col gap-12">
      <nav aria-label="Breadcrumb" className="text-sm">
        <a href={`${hrefPrefix}/`}>Home</a> ·{' '}
        <a href={`${hrefPrefix}/services`}>Our services</a> · Supported Independent Living
      </nav>

      <HeadlineBlock eyebrow="Housing" headline="Supported Independent Living.">
        <p>
          A shared home with the support you need — at the times you need it, in a way that suits how you live.
          SIL is for people who want help to live independently in their own home or in one of ours.
        </p>
      </HeadlineBlock>

      <div className="flex flex-wrap gap-2">
        <Tag variant="outline">NDIS</Tag>
      </div>

      <Section number={1} title="What is SIL?">
        {service?.content ? (
          <RichText value={service.content} />
        ) : (
          <p className="text-base leading-relaxed max-w-prose">
            Supported Independent Living (SIL) is an NDIS-funded support category that helps people with
            disability live as independently as possible. SIL can be delivered in shared homes — often called
            SDA homes — or in a person&apos;s own home. The supports vary from a few hours a day to overnight
            sleepover and 24-hour care.
          </p>
        )}
      </Section>

      <Section number={2} title="Who is SIL for?">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <KeyPointsBlock
            title="SIL works well for people who…"
            points={[
              'Have NDIS funding that includes SIL support category',
              'Want to live more independently than at home with family',
              'Need support with daily tasks like cooking, cleaning, or medication',
              'Are looking for housemates with similar needs and interests',
              'Value routine and choice in equal measure',
            ]}
          />
          <KeyPointsBlock
            title="What CareChoice promises."
            points={[
              'A consistent team of support workers — not a rotating cast',
              'Clinical backup for complex care needs, 24/7',
              'A say in who lives with you',
              'Local connection — your suburb is your suburb, not a placement',
              'Independence-first support — we help you do, not do for you',
            ]}
          />
        </div>
      </Section>

      <Section number={3} title="How CareChoice delivers SIL.">
        <FundingTabs
          tabs={[
            {
              id: 'ndis',
              label: 'NDIS',
              content: (
                <div className="flex flex-col gap-3">
                  <p className="text-base leading-relaxed max-w-prose">
                    For NDIS participants, SIL is funded under your Core Supports — Assistance with Daily Life
                    line. We work with your plan manager, support coordinator, and the NDIA to make sure the
                    support hours match your plan.
                  </p>
                  <p className="text-base leading-relaxed max-w-prose">
                    We invoice the NDIA directly via the plan-managed pathway, or through your plan manager —
                    whichever way your plan is set up.
                  </p>
                </div>
              ),
            },
            {
              id: 'tac',
              label: 'TAC',
              content: (
                <p className="text-base leading-relaxed max-w-prose">
                  For TAC clients (Transport Accident Commission, Victoria), CareChoice is an approved provider.
                  Our team works with your TAC support coordinator on rates, hours, and reporting.
                </p>
              ),
            },
            {
              id: 'worksafe',
              label: 'WorkSafe',
              content: (
                <p className="text-base leading-relaxed max-w-prose">
                  WorkSafe Victoria participants are supported under the same framework as NDIS in practical
                  terms — same care team, same homes — with the funding pathway adjusted to your WorkSafe plan.
                </p>
              ),
            },
          ]}
        />
      </Section>

      <Section number={4} title="How to get started.">
        <StepByStepBlock
          steps={[
            {
              title: 'Have a chat with us.',
              body: 'A short phone call or a coffee in person. We ask about you, your plan, and what you want from a home. No commitment.',
            },
            {
              title: 'Meet the team.',
              body: 'You meet the support workers who would be in your home day-to-day. Bring family, a support coordinator, anyone you want there.',
            },
            {
              title: 'See the home.',
              body: 'If a shared SDA home is right for you, you visit it. Meet the housemates. Walk through the space.',
            },
            {
              title: 'We build a plan.',
              body: 'Together with you and your support coordinator, we map out hours, supports, and the practical things — meals, medication, getting to work or programs.',
            },
            {
              title: 'You move in (or we come to you).',
              body: 'For SDA, we handle the tenancy paperwork. For at-home SIL, the team starts on the dates your plan begins.',
            },
          ]}
        />
      </Section>

      <Section number={5} title="Standards & safeguards.">
        <AccordionBlock
          items={[
            {
              id: 'sps',
              heading: 'Specialist Disability Accommodation (SDA) Design Standards.',
              body: (
                <p>
                  Our SDA-approved homes meet one of four NDIS-defined design categories: Improved Liveability,
                  Robust, Fully Accessible, or High Physical Support. The category determines the build features
                  — wider doorways, hoist mounts, zoned bedrooms, reinforced fittings — and whether the property
                  is right for your needs.
                </p>
              ),
            },
            {
              id: 'sil-rules',
              heading: 'NDIS SIL Practice Standards.',
              body: (
                <p>
                  SIL providers are audited annually against the NDIS Practice Standards. CareChoice is a
                  registered NDIS provider; our most recent audit is publicly available on request.
                </p>
              ),
            },
            {
              id: 'complaints',
              heading: 'Complaints and feedback.',
              body: (
                <p>
                  Anyone can raise a concern with us, the NDIS Quality and Safeguards Commission, or the relevant
                  state body. We&apos;d rather hear it early than late — get in touch via our contact page or call
                  the NDIS Commission directly on 1800 035 544.
                </p>
              ),
            },
            {
              id: 'sil-pricing-2026',
              heading: 'SIL pricing changes — 1 July 2026.',
              body: (
                <p>
                  The NDIS is changing how SIL is priced from 1 July 2026. We&apos;ve briefed our team and
                  participants on what to expect; if you have questions, ask us on enquiry — we&apos;d rather
                  explain than have you guess.
                </p>
              ),
            },
          ]}
        />
      </Section>

      <Section number={6} title="Frequently asked questions.">
        <AccordionBlock
          items={[
            {
              id: 'q-shared-home',
              heading: 'Do I have to live in a shared home?',
              body: <p>No. SIL can be delivered in your own home. We support both.</p>,
            },
            {
              id: 'q-choose-housemates',
              heading: 'Can I choose my housemates?',
              body: (
                <p>
                  Yes — we won&apos;t move you in without you meeting the people you&apos;d live with first. If
                  it&apos;s not the right fit, we keep looking.
                </p>
              ),
            },
            {
              id: 'q-change-support',
              heading: 'What if I want to change my support workers?',
              body: (
                <p>
                  Tell your team coordinator. We listen and adjust — this is your life and your choice. Switching
                  workers shouldn&apos;t require a big formal process.
                </p>
              ),
            },
            {
              id: 'q-non-ndis',
              heading: 'I&apos;m not on the NDIS — can I still get SIL?',
              body: (
                <p>
                  If you&apos;re a TAC or WorkSafe participant, yes — see the funding tabs above. For privately
                  funded support, get in touch and we&apos;ll talk through options.
                </p>
              ),
            },
          ]}
        />
      </Section>

      <CTABlock
        eyebrow="Make a start"
        title="Talk to us about SIL."
        body="A phone call, an email, or a face-to-face meeting — whatever works for you."
        primary={{ label: 'Make an enquiry.', href: '/enquiry' }}
        secondary={{ label: 'Find a home.', href: '/find-a-home' }}
      />
    </div>
  )
}

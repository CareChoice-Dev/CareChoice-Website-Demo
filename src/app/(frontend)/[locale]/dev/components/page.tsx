import { Module } from '@/components/primitives/Module'
import { Section } from '@/components/primitives/Section'
import { Button } from '@/components/primitives/Button'
import { Tag } from '@/components/primitives/Tag'
import { Hero } from '@/components/blocks/Hero'
import { ServiceCard } from '@/components/blocks/ServiceCard'
import { CaseStudyCard } from '@/components/blocks/CaseStudyCard'
import { ValueBlock } from '@/components/blocks/ValueBlock'
import { HeadlineBlock } from '@/components/blocks/HeadlineBlock'

export const metadata = { title: 'Component library — CareChoice.' }

export default function ComponentsPage() {
  return (
    <div className="max-w-[1280px] mx-auto px-6 md:px-8 py-10 flex flex-col gap-12">
      <h1 className="text-4xl md:text-6xl font-bold tracking-tight">Component library.</h1>
      <p className="text-lg leading-relaxed max-w-prose">
        One of every primitive and block, in their default states. This page exists so the team
        can review the building blocks at a glance before they land in real templates.
      </p>

      <Section number={1} title="Modules.">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Module className="p-4">Default 7px border.</Module>
          <Module weight="card" className="p-4">Card 4px border.</Module>
          <Module weight="thin" className="p-4">Thin 2px border.</Module>
          <Module fill="magenta" className="p-4">Magenta fill.</Module>
          <Module fill="magenta-60" className="p-4">Magenta-60 fill.</Module>
          <Module fill="surface-pink" className="p-4">Surface-pink fill.</Module>
        </div>
      </Section>

      <Section number={2} title="Buttons.">
        <div className="flex flex-wrap gap-4">
          <Button>Primary.</Button>
          <Button variant="secondary">Secondary.</Button>
          <Button variant="ghost">Ghost.</Button>
          <Button size="lg">Primary large.</Button>
          <Button href="/dev/components">As link.</Button>
        </div>
      </Section>

      <Section number={3} title="Tags.">
        <div className="flex flex-wrap gap-3">
          <Tag>NDIS</Tag>
          <Tag variant="soft">TAC</Tag>
          <Tag variant="outline">WorkSafe</Tag>
          <Tag variant="pink">Private</Tag>
        </div>
      </Section>

      <Section number={4} title="Hero.">
        <Hero
          title="Live the life you choose."
          lead="We&apos;ll be there. CareChoice supports people with disability across Australia."
          ctas={[
            { label: 'Find a home.', href: '/find-a-home' },
            { label: 'Our services.', href: '/services' },
          ]}
        />
      </Section>

      <Section number={5} title="Cards.">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ServiceCard
            title="Supported Independent Living."
            href="/services/supported-independent-living"
            category="Housing"
            intro="Live in a shared home with the support you need, day and night."
            fundingTypes={['NDIS']}
          />
          <CaseStudyCard
            title="Finding home in Brunswick."
            href="/case-studies/sample"
            participantName="Mira"
            summary="From a long stay in hospital to a place that finally feels like home."
          />
          <ValueBlock value="800+" label="Employees across Australia." />
        </div>
      </Section>

      <Section number={6} title="Headline.">
        <HeadlineBlock
          eyebrow="Why CareChoice."
          headline="Real care. Real choices. Right where you are."
        >
          <p>
            We&apos;ve been doing this for thirty years. The work is hard, the difference matters,
            and we&apos;re getting better at it every day.
          </p>
        </HeadlineBlock>
      </Section>
    </div>
  )
}

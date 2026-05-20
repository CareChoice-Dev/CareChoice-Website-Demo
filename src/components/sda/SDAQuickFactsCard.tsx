import { Module } from '@/components/primitives/Module'
import { Button } from '@/components/primitives/Button'
import type { SDAVacancy } from './types'

export function SDAQuickFactsCard({
  home,
  hrefPrefix,
}: {
  home: SDAVacancy
  hrefPrefix: string
}) {
  return (
    <aside className="md:sticky md:top-6 flex flex-col gap-4">
      <Module weight="card" className="p-5 flex flex-col gap-3">
        <span className="eyebrow">Quick facts.</span>
        <dl className="flex flex-col gap-2 text-sm">
          {home.designStandard && (
            <div className="flex justify-between gap-2">
              <dt className="text-cc-fg-muted">Design</dt>
              <dd className="font-semibold text-right">{home.designStandard}</dd>
            </div>
          )}
          {home.propertyType && (
            <div className="flex justify-between gap-2">
              <dt className="text-cc-fg-muted">Property</dt>
              <dd className="font-semibold text-right">{home.propertyType}</dd>
            </div>
          )}
          {home.tenancyStatus && (
            <div className="flex justify-between gap-2">
              <dt className="text-cc-fg-muted">Tenancy</dt>
              <dd className="font-semibold text-right">{home.tenancyStatus}</dd>
            </div>
          )}
          <div className="flex justify-between gap-2 pt-2 border-t-2 border-cc-black">
            <dt className="text-cc-fg-muted">Active beds</dt>
            <dd className="font-semibold">{home.activeBeds}</dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-cc-fg-muted">Available now</dt>
            <dd className="font-bold text-cc-pms-675">{home.availableBeds}</dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-cc-fg-muted">Weekly cost</dt>
            <dd className="font-semibold">Discuss on enquiry</dd>
          </div>
        </dl>
      </Module>

      <Button href={`${hrefPrefix}/enquiry?home=${home.id}`} variant="primary" size="lg" className="w-full">
        Enquire about this home. ▸
      </Button>

      {home.sharepointUrl && (
        <Button href={home.sharepointUrl} variant="secondary" size="md" className="w-full">
          Photos &amp; floorplans (SharePoint) ▸
        </Button>
      )}
    </aside>
  )
}

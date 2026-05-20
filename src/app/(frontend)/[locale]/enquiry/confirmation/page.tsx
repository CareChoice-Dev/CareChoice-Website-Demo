import { notFound } from 'next/navigation'
import { isUrlSlug } from '@/lib/locale'
import { Module } from '@/components/primitives/Module'
import { Button } from '@/components/primitives/Button'

export default async function ConfirmationPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale: urlLocale } = await params
  if (!isUrlSlug(urlLocale)) notFound()

  return (
    <div className="max-w-[800px] mx-auto px-6 md:px-8 py-10 flex flex-col gap-8">
      <Module fill="magenta" weight="default" className="p-8 md:p-12 flex flex-col gap-4">
        <span className="eyebrow">Thank you.</span>
        <h1 className="text-3xl md:text-5xl font-bold leading-tight tracking-tight">
          Your enquiry is with us.
        </h1>
        <p className="text-lg leading-relaxed max-w-2xl">
          A team member will be in touch within one business day. If you need to talk to someone sooner,
          call us on 1300 737 942.
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <Button href="/" variant="primary" size="lg">Back to home. ▸</Button>
          <Button href="/find-a-home" variant="secondary" size="lg">Look at homes. ▸</Button>
        </div>
      </Module>
    </div>
  )
}

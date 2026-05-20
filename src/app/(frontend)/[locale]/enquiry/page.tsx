import { notFound } from 'next/navigation'
import { isUrlSlug } from '@/lib/locale'
import { EnquiryForm } from '@/components/forms/EnquiryForm'

export default async function EnquiryPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale: urlLocale } = await params
  if (!isUrlSlug(urlLocale)) notFound()

  return (
    <div className="max-w-[800px] mx-auto px-6 md:px-8 py-10 flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <span className="eyebrow">Get in touch.</span>
        <h1 className="text-4xl md:text-6xl font-bold leading-tight tracking-tight">
          Make an enquiry.
        </h1>
        <p className="text-lg leading-relaxed">
          Three short steps. We&apos;ll come back to you within one business day.
        </p>
      </header>

      <EnquiryForm confirmationPath={`/${urlLocale}/enquiry/confirmation`} />
    </div>
  )
}

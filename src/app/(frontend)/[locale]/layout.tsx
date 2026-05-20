import React from 'react'
import { notFound } from 'next/navigation'
import { isUrlSlug, urlSlugToLocale, htmlLangFor } from '@/lib/locale'

export async function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'vi' }, { locale: 'zh' }, { locale: 'easy-read' }]
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale: urlLocale } = await params

  if (!isUrlSlug(urlLocale)) {
    notFound()
  }

  const payloadLocale = urlSlugToLocale(urlLocale)
  const htmlLang = htmlLangFor(payloadLocale)

  return (
    <html lang={htmlLang}>
      <body>
        <main>{children}</main>
      </body>
    </html>
  )
}

import React from 'react'
import { notFound } from 'next/navigation'
import { isUrlSlug, urlSlugToLocale, htmlLangFor } from '@/lib/locale'
import { Header } from '@/components/chrome/Header'
import { Footer } from '@/components/chrome/Footer'
import { SkipToMain } from '@/components/chrome/SkipToMain'
import { ChatStub } from '@/components/chrome/ChatStub'
import { A11yApplyClient } from '@/components/chrome/A11yApplyClient'

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
  if (!isUrlSlug(urlLocale)) notFound()
  const payloadLocale = urlSlugToLocale(urlLocale)
  const htmlLang = htmlLangFor(payloadLocale)

  return (
    <html
      lang={htmlLang}
      data-easy-read={payloadLocale === 'en-easy-read' ? 'true' : undefined}
    >
      <body>
        <SkipToMain />
        <A11yApplyClient />
        <Header locale={payloadLocale} />
        <main id="main">{children}</main>
        <Footer locale={payloadLocale} />
        <ChatStub />
      </body>
    </html>
  )
}

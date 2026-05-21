import React from 'react'
import { notFound } from 'next/navigation'
import localFont from 'next/font/local'
import { JetBrains_Mono } from 'next/font/google'
import { isUrlSlug, urlSlugToLocale, htmlLangFor } from '@/lib/locale'
import { Header } from '@/components/chrome/Header'
import { Footer } from '@/components/chrome/Footer'
import { SkipToMain } from '@/components/chrome/SkipToMain'
import { AgentforceEmbed } from '@/components/chrome/AgentforceEmbed'
import { A11yApplyClient } from '@/components/chrome/A11yApplyClient'

const sourceSans3 = localFont({
  src: [
    {
      path: '../../../../public/fonts/SourceSans3-VariableFont_wght.ttf',
      style: 'normal',
      weight: '200 900',
    },
    {
      path: '../../../../public/fonts/SourceSans3-Italic-VariableFont_wght.ttf',
      style: 'italic',
      weight: '200 900',
    },
  ],
  display: 'swap',
  variable: '--cc-font-sans-loaded',
  preload: true,
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
  variable: '--cc-font-mono-loaded',
  preload: false,
})

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
      className={`${sourceSans3.variable} ${jetbrainsMono.variable}`}
    >
      <body>
        <SkipToMain />
        <A11yApplyClient />
        <Header locale={payloadLocale} />
        <main id="main">{children}</main>
        <Footer locale={payloadLocale} />
        <AgentforceEmbed />
      </body>
    </html>
  )
}

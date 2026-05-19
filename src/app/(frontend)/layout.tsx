import React from 'react'
import { headers } from 'next/headers'
import './styles.css'

export const metadata = {
  description: 'CareChoice website demo — Week 1 foundation.',
  title: 'CareChoice demo.',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const h = await headers()
  const locale = h.get('x-locale') ?? 'en'
  const htmlLang = locale === 'zh' ? 'zh-Hans' : locale.split('-')[0]

  return (
    <html lang={htmlLang}>
      <body>
        <main>{props.children}</main>
      </body>
    </html>
  )
}

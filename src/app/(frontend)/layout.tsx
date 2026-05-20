import React from 'react'
import './styles.css'

export const metadata = {
  description: 'CareChoice website demo — Week 2 build.',
  title: 'CareChoice.',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  return props.children
}

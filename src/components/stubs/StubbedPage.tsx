import { Module } from '@/components/primitives/Module'

export interface StubbedPageProps {
  title: string
  blurb?: string
}

export function StubbedPage({ title, blurb }: StubbedPageProps) {
  return (
    <div className="max-w-[1280px] mx-auto px-6 md:px-8 py-10 flex flex-col gap-6">
      <Module fill="surface-pink" weight="card" className="p-4 text-sm font-semibold">
        Preview content — full design applied in production build.
      </Module>
      <h1 className="text-4xl md:text-6xl font-bold leading-tight tracking-tight">{title}</h1>
      {blurb && <p className="text-lg leading-relaxed max-w-prose">{blurb}</p>}
    </div>
  )
}

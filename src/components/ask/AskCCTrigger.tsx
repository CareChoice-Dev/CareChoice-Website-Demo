'use client'

import { useState } from 'react'
import { useAskStore } from './ask-store'

export type AskCCTriggerVariant = 'hero' | 'floating' | 'header-icon'

const HERO_CHIPS = [
  'Show me available SIL homes',
  'What services do you offer?',
  'Make an enquiry',
]

export interface AskCCTriggerProps {
  variant: AskCCTriggerVariant
  className?: string
}

/**
 * Three visual entry points to the Ask CareChoice panel. All call the same store action
 * so the panel can be opened from the homepage hero, the floating button, or the
 * header icon.
 */
export function AskCCTrigger({ variant, className }: AskCCTriggerProps) {
  const openPanel = useAskStore((s) => s.openPanel)
  const setPendingInput = useAskStore((s) => s.setPendingInput)
  const submit = useAskStore((s) => s.submit)
  const [heroInput, setHeroInput] = useState('')

  if (variant === 'hero') {
    const handleHeroSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      const trimmed = heroInput.trim()
      openPanel()
      if (trimmed) {
        setPendingInput(trimmed)
        await submit(trimmed)
        setHeroInput('')
      }
    }
    const handleChip = async (chip: string) => {
      openPanel()
      setPendingInput(chip)
      await submit(chip)
    }
    return (
      <div data-askcc-trigger className={`flex flex-col gap-3 ${className ?? ''}`}>
        <form onSubmit={handleHeroSubmit} className="flex flex-col sm:flex-row gap-0 border-4 border-cc-black bg-cc-white shadow-hard-card">
          <label className="sr-only" htmlFor="askcc-hero-input">
            Ask CareChoice anything
          </label>
          <input
            id="askcc-hero-input"
            value={heroInput}
            onChange={(e) => setHeroInput(e.target.value)}
            onFocus={() => openPanel()}
            placeholder="Ask CareChoice anything — services, homes, or how to enquire."
            className="flex-1 px-4 py-4 text-base sm:text-lg border-0 sm:border-r-2 border-b-2 sm:border-b-0 border-cc-black focus:outline-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-cc-magenta focus:bg-cc-surface-pink/30"
            aria-label="Ask CareChoice anything"
          />
          <button
            type="submit"
            className="px-6 py-4 bg-cc-magenta text-white font-bold text-base hover:bg-cc-pms-675 focus-visible:outline-2 focus-visible:outline-cc-black focus-visible:outline-offset-2 motion-reduce:transition-none"
          >
            Ask ▸
          </button>
        </form>
        <div className="flex flex-wrap gap-2">
          {HERO_CHIPS.map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => handleChip(chip)}
              className="text-sm font-semibold px-3 py-1.5 border-2 border-cc-black bg-cc-white text-cc-black hover:bg-cc-surface-pink transition-colors motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-cc-magenta focus-visible:outline-offset-2"
            >
              {chip}
            </button>
          ))}
        </div>
        <p className="text-xs text-cc-fg-muted">
          Tip — press <kbd className="border border-cc-black px-1 rounded-none">⌘K</kbd> anywhere on the site.
        </p>
      </div>
    )
  }

  if (variant === 'floating') {
    return (
      <button
        type="button"
        data-askcc-trigger
        onClick={openPanel}
        aria-label="Open Ask CareChoice"
        className={`fixed bottom-6 right-6 z-40 bg-cc-magenta text-white font-bold border-2 border-cc-black px-5 py-3 rounded-none shadow-hard-card hover:-translate-x-[2px] hover:-translate-y-[2px] motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-cc-black focus-visible:outline-offset-2 ${className ?? ''}`}
      >
        Ask CareChoice. ▸
      </button>
    )
  }

  // header-icon
  return (
    <button
      type="button"
      data-askcc-trigger
      onClick={openPanel}
      aria-label="Open Ask CareChoice"
      className={`inline-flex items-center gap-1.5 h-[28px] px-2 border-2 border-cc-black bg-cc-white text-cc-black font-semibold text-xs hover:bg-cc-surface-pink transition-colors motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-cc-magenta focus-visible:outline-offset-2 ${className ?? ''}`}
    >
      <svg
        aria-hidden
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="11" cy="11" r="7" />
        <line x1="20" y1="20" x2="16.65" y2="16.65" />
      </svg>
      <span>Ask</span>
      <kbd className="hidden sm:inline-block text-[10px] border border-cc-black px-1 leading-none">⌘K</kbd>
    </button>
  )
}

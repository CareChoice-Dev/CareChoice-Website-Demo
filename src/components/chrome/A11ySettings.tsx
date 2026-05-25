'use client'

import { useA11yStore } from '@/stores/a11y-store'
import { useId } from 'react'

const SIZES = [
  { key: 'sm', label: 'A−', aria: 'Smaller text' },
  { key: 'default', label: 'A', aria: 'Default text size' },
  { key: 'lg', label: 'A+', aria: 'Larger text' },
] as const

export function A11ySettings() {
  const contrastId = useId()
  const {
    textSize,
    contrast,
    dyslexiaFont,
    reduceMotion,
    setTextSize,
    setContrast,
    toggleDyslexiaFont,
    toggleReduceMotion,
  } = useA11yStore()

  return (
    <div className="flex flex-wrap items-center gap-1.5 text-xs" role="group" aria-label="Accessibility settings">
      <div className="flex gap-0" role="group" aria-label="Text size">
        {SIZES.map((s) => {
          const active = textSize === s.key
          return (
            <button
              key={s.key}
              type="button"
              aria-pressed={active}
              aria-label={s.aria}
              onClick={() => setTextSize(s.key)}
              className={`min-w-[28px] h-[28px] px-1.5 border-2 border-cc-black -ml-[2px] first:ml-0 font-semibold text-xs ${
                active ? 'bg-cc-magenta text-white' : 'bg-white text-cc-black hover:bg-cc-surface-pink'
              }`}
            >
              {s.label}
            </button>
          )
        })}
      </div>

      <label htmlFor={contrastId} className="flex items-center ml-1">
        <span className="sr-only">Contrast</span>
        <select
          id={contrastId}
          value={contrast}
          onChange={(e) => setContrast(e.target.value as 'auto' | 'high')}
          className="border-2 border-cc-black px-1.5 h-[28px] bg-cc-white font-semibold text-xs"
        >
          <option value="auto">Contrast: auto</option>
          <option value="high">Contrast: high</option>
        </select>
      </label>

      <button
        type="button"
        aria-pressed={dyslexiaFont}
        onClick={toggleDyslexiaFont}
        className={`h-[28px] px-2.5 border-2 border-cc-black font-semibold text-xs ${
          dyslexiaFont ? 'bg-cc-magenta text-white' : 'bg-white text-cc-black hover:bg-cc-surface-pink'
        }`}
      >
        Dyslexia font
      </button>

      <button
        type="button"
        aria-pressed={reduceMotion}
        onClick={toggleReduceMotion}
        className={`h-[28px] px-2.5 border-2 border-cc-black font-semibold text-xs ${
          reduceMotion ? 'bg-cc-magenta text-white' : 'bg-white text-cc-black hover:bg-cc-surface-pink'
        }`}
      >
        Reduce motion
      </button>

      <span aria-live="polite" className="sr-only">
        {textSize === 'sm' ? 'Smaller text' : textSize === 'lg' ? 'Larger text' : 'Default text size'}.{' '}
        Contrast {contrast}.{' '}
        Dyslexia font {dyslexiaFont ? 'on' : 'off'}.{' '}
        Reduced motion {reduceMotion ? 'on' : 'off'}.
      </span>
    </div>
  )
}

'use client'

import { useEffect } from 'react'
import { useA11yStore } from '@/stores/a11y-store'

/**
 * Renders nothing. Subscribes to the a11y store and writes its state to
 * <html data-text-size>, <html data-contrast>, etc. on every change.
 */
export function A11yApplyClient() {
  const textSize = useA11yStore((s) => s.textSize)
  const contrast = useA11yStore((s) => s.contrast)
  const dyslexiaFont = useA11yStore((s) => s.dyslexiaFont)
  const reduceMotion = useA11yStore((s) => s.reduceMotion)

  useEffect(() => {
    const html = document.documentElement
    html.setAttribute('data-text-size', textSize)
    html.setAttribute('data-contrast', contrast)
    html.setAttribute('data-dyslexia-font', String(dyslexiaFont))
    html.setAttribute('data-reduce-motion', String(reduceMotion))
  }, [textSize, contrast, dyslexiaFont, reduceMotion])

  return null
}

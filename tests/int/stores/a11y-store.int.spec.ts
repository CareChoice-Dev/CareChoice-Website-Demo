import { describe, it, expect, beforeEach } from 'vitest'
import { useA11yStore, A11Y_DEFAULTS } from '@/stores/a11y-store'

describe('a11y store', () => {
  beforeEach(() => {
    useA11yStore.setState(A11Y_DEFAULTS)
    localStorage.clear()
  })

  it('starts at defaults', () => {
    const s = useA11yStore.getState()
    expect(s.textSize).toBe('default')
    expect(s.contrast).toBe('auto')
    expect(s.dyslexiaFont).toBe(false)
    expect(s.reduceMotion).toBe(false)
  })

  it('cycles text size', () => {
    const { setTextSize } = useA11yStore.getState()
    setTextSize('lg')
    expect(useA11yStore.getState().textSize).toBe('lg')
    setTextSize('sm')
    expect(useA11yStore.getState().textSize).toBe('sm')
  })

  it('toggles dyslexia font', () => {
    const { toggleDyslexiaFont } = useA11yStore.getState()
    toggleDyslexiaFont()
    expect(useA11yStore.getState().dyslexiaFont).toBe(true)
    toggleDyslexiaFont()
    expect(useA11yStore.getState().dyslexiaFont).toBe(false)
  })

  it('toggles reduce motion', () => {
    const { toggleReduceMotion } = useA11yStore.getState()
    toggleReduceMotion()
    expect(useA11yStore.getState().reduceMotion).toBe(true)
  })

  it('sets contrast mode', () => {
    const { setContrast } = useA11yStore.getState()
    setContrast('high')
    expect(useA11yStore.getState().contrast).toBe('high')
  })

  it('reset returns to defaults', () => {
    const { setTextSize, toggleDyslexiaFont, reset } = useA11yStore.getState()
    setTextSize('lg')
    toggleDyslexiaFont()
    reset()
    expect(useA11yStore.getState()).toMatchObject(A11Y_DEFAULTS)
  })
})

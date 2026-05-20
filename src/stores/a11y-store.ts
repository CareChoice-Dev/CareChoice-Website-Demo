import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type TextSize = 'sm' | 'default' | 'lg'
export type Contrast = 'auto' | 'high'

export interface A11yState {
  textSize: TextSize
  contrast: Contrast
  dyslexiaFont: boolean
  reduceMotion: boolean
  setTextSize: (size: TextSize) => void
  setContrast: (mode: Contrast) => void
  toggleDyslexiaFont: () => void
  toggleReduceMotion: () => void
  reset: () => void
}

export const A11Y_DEFAULTS = {
  textSize: 'default' as TextSize,
  contrast: 'auto' as Contrast,
  dyslexiaFont: false,
  reduceMotion: false,
}

export const useA11yStore = create<A11yState>()(
  persist(
    (set) => ({
      ...A11Y_DEFAULTS,
      setTextSize: (textSize) => set({ textSize }),
      setContrast: (contrast) => set({ contrast }),
      toggleDyslexiaFont: () => set((s) => ({ dyslexiaFont: !s.dyslexiaFont })),
      toggleReduceMotion: () => set((s) => ({ reduceMotion: !s.reduceMotion })),
      reset: () => set(A11Y_DEFAULTS),
    }),
    {
      name: 'cc-a11y',
      skipHydration: typeof window === 'undefined',
    },
  ),
)

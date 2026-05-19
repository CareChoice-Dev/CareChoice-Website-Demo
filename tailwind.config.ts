import type { Config } from 'tailwindcss'

export default {
  content: [
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
    './src/blocks/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'cc-magenta': 'var(--cc-magenta)',
        'cc-magenta-60': 'var(--cc-magenta-60)',
        'cc-pms-675': 'var(--cc-pms-675)',
        'cc-black': 'var(--cc-black)',
        'cc-white': 'var(--cc-white)',
        'cc-surface-pink': 'var(--cc-surface-pink)',
        'cc-fg-muted': 'var(--cc-fg-muted)',
      },
      fontFamily: {
        sans: ['var(--cc-font-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--cc-font-mono)', 'monospace'],
      },
      borderRadius: {
        // CareChoice is hard-edged. No radius allowed.
        none: '0',
      },
    },
  },
  plugins: [],
} satisfies Config

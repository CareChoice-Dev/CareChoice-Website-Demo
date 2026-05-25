'use client'

import { useCallback, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { useAskStore } from './ask-store'
import { AskCCMessageList } from './AskCCMessageList'

const QUICK_START_CHIPS = [
  'Show me available SIL homes',
  'What services do you offer?',
  'Make an enquiry',
]

/**
 * Detects the URL-locale slug from the current pathname and returns "/<slug>".
 * Falls back to "/en" if we can't detect one.
 */
function useHrefPrefix(): string {
  const pathname = usePathname() ?? '/'
  const seg = pathname.split('/')[1] ?? ''
  const valid = new Set(['en', 'vi', 'zh', 'easy-read'])
  return valid.has(seg) ? `/${seg}` : '/en'
}

/**
 * AskCC — right-side slide-out panel hosting the Ask CareChoice assistant.
 * Mounted globally in the layout; toggled via useAskStore().
 */
export function AskCC() {
  const open = useAskStore((s) => s.open)
  const closePanel = useAskStore((s) => s.closePanel)
  const openPanel = useAskStore((s) => s.openPanel)
  const togglePanel = useAskStore((s) => s.togglePanel)
  const thread = useAskStore((s) => s.thread)
  const pendingInput = useAskStore((s) => s.pendingInput)
  const setPendingInput = useAskStore((s) => s.setPendingInput)
  const submit = useAskStore((s) => s.submit)
  const setDemoAfterHours = useAskStore((s) => s.setDemoAfterHours)

  const panelRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const lastFocusRef = useRef<HTMLElement | null>(null)

  const hrefPrefix = useHrefPrefix()

  // Read ?demo-after-hours=1 on mount
  useEffect(() => {
    if (typeof window === 'undefined') return
    const params = new URLSearchParams(window.location.search)
    if (params.get('demo-after-hours') === '1') {
      setDemoAfterHours(true)
    }
  }, [setDemoAfterHours])

  // Global Cmd+K / Ctrl+K to open
  useEffect(() => {
    if (typeof window === 'undefined') return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        togglePanel()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [togglePanel])

  // Focus management — record previous focus when opening, restore on close
  useEffect(() => {
    if (open) {
      lastFocusRef.current = document.activeElement as HTMLElement | null
      // Small delay so the input is in the DOM and animation has started
      requestAnimationFrame(() => {
        inputRef.current?.focus()
      })
    } else if (lastFocusRef.current) {
      lastFocusRef.current.focus()
      lastFocusRef.current = null
    }
  }, [open])

  // Push the body content left on desktop so the panel narrows the page
  // (Salesforce-style) instead of overlaying it. CSS handles the transition
  // and the md+ breakpoint.
  useEffect(() => {
    if (typeof document === 'undefined') return
    document.body.classList.toggle('askcc-open', open)
    return () => {
      document.body.classList.remove('askcc-open')
    }
  }, [open])

  // Esc closes — no focus trap, the rest of the page stays interactive.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        closePanel()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, closePanel])

  // Click anywhere outside the panel (or its triggers) closes — Salesforce style.
  // Defer subscribing one tick after open so the opening click doesn't immediately
  // close again.
  useEffect(() => {
    if (!open) return
    let armed = false
    const arm = setTimeout(() => {
      armed = true
    }, 0)
    const onPointerDown = (e: PointerEvent) => {
      if (!armed) return
      const panel = panelRef.current
      const target = e.target as HTMLElement | null
      if (!panel || !target) return
      if (panel.contains(target)) return
      if (target.closest('[data-askcc-trigger]')) return
      closePanel()
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => {
      clearTimeout(arm)
      document.removeEventListener('pointerdown', onPointerDown)
    }
  }, [open, closePanel])

  const handleSubmit = useCallback(
    async (e?: React.FormEvent<HTMLFormElement>) => {
      if (e) e.preventDefault()
      const text = pendingInput.trim()
      if (!text) return
      // Open the panel if it isn't already (covers the hero-trigger submit path)
      if (!open) openPanel()
      await submit(text)
    },
    [pendingInput, submit, open, openPanel],
  )

  const handleChip = useCallback(
    async (text: string) => {
      setPendingInput(text)
      // Submit immediately — chip click acts as a pre-filled send
      if (!open) openPanel()
      await submit(text)
    },
    [submit, open, openPanel, setPendingInput],
  )

  return (
    <>
      {/* Backdrop on mobile only — desktop pushes content instead */}
      {open && (
        <button
          type="button"
          aria-label="Close Ask CareChoice"
          onClick={closePanel}
          className="fixed inset-0 z-40 bg-cc-black/30 md:hidden"
          tabIndex={-1}
        />
      )}

      <aside
        ref={panelRef}
        role="dialog"
        aria-label="Ask CareChoice"
        aria-hidden={!open}
        className={`fixed top-0 right-0 z-50 h-full w-full md:w-[420px] bg-cc-white border-l-4 border-cc-black shadow-hard-card flex flex-col transition-transform duration-300 ease-out motion-reduce:transition-none ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <header className="bg-cc-magenta text-white border-b-2 border-cc-black px-4 py-3 flex items-center justify-between">
          <div className="flex flex-col leading-tight">
            <span className="font-bold text-lg">Ask CareChoice.</span>
            <span className="text-xs opacity-90">Find a home, services, or talk to our team.</span>
          </div>
          <button
            type="button"
            onPointerDown={(e) => {
              e.preventDefault()
              closePanel()
            }}
            onClick={closePanel}
            aria-label="Close Ask CareChoice"
            className="text-white text-2xl leading-none px-2 py-1 hover:bg-cc-black/20 focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2"
          >
            ✕
          </button>
        </header>

        {/* Conversation */}
        <AskCCMessageList thread={thread} hrefPrefix={hrefPrefix} onChip={handleChip} />

        {/* Quick-start chips when thread is empty */}
        {thread.length === 0 && (
          <div className="px-4 py-2 flex flex-wrap gap-2 border-t-2 border-cc-black bg-cc-white">
            {QUICK_START_CHIPS.map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => handleChip(chip)}
                className="text-xs font-semibold px-2 py-1 border-2 border-cc-black bg-cc-white text-cc-black hover:bg-cc-surface-pink transition-colors motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-cc-magenta focus-visible:outline-offset-2"
              >
                {chip}
              </button>
            ))}
          </div>
        )}

        {/* Input form */}
        <form onSubmit={handleSubmit} className="border-t-2 border-cc-black flex">
          <label className="sr-only" htmlFor="askcc-input">
            Ask CareChoice anything
          </label>
          <input
            id="askcc-input"
            ref={inputRef}
            value={pendingInput}
            onChange={(e) => setPendingInput(e.target.value)}
            placeholder="Ask CareChoice anything..."
            className="flex-1 px-3 py-3 border-r-2 border-cc-black focus:outline-none focus:bg-cc-surface-pink/50"
            aria-label="Ask CareChoice anything"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-cc-magenta text-white font-semibold hover:bg-cc-pms-675 motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-cc-black focus-visible:outline-offset-2"
          >
            Send ▸
          </button>
        </form>

        {/* Powered-by footer */}
        <footer className="px-4 py-2 border-t-2 border-cc-black bg-cc-surface-pink text-center">
          <p className="text-[11px] text-cc-fg-muted">
            Powered by <span className="font-semibold">Agentforce</span>.
          </p>
        </footer>
      </aside>
    </>
  )
}

'use client'

import { create } from 'zustand'
import { routeIntent, type AskResponse } from './ask-intents'
import type { SDAVacancy } from '@/components/sda/types'

export type MessageAuthor = 'user' | 'agent'

export interface AskMessage {
  id: string
  author: MessageAuthor
  /** Body text. For typing placeholders this is empty and `typing` is true. */
  text: string
  /** Marks an agent typing-indicator bubble. */
  typing?: boolean
  /** Source-link cards rendered beneath an agent message. */
  sourceLinks?: AskResponse['sourceLinks']
  /** Follow-up suggestion chips rendered beneath an agent message. */
  followUpChips?: string[]
  /** Inline live SDA home cards for `homes` intent. */
  homes?: SDAVacancy[]
  /** The classified intent (debug / future analytics). */
  intent?: AskResponse['intent']
}

export interface AskState {
  open: boolean
  thread: AskMessage[]
  demoAfterHours: boolean
  pendingInput: string
  openPanel: () => void
  closePanel: () => void
  togglePanel: () => void
  submit: (message: string) => Promise<void>
  clear: () => void
  setDemoAfterHours: (v: boolean) => void
  setPendingInput: (v: string) => void
  /** Visible for testing — replaces the live fetch. */
  _fetchVacancies?: (region?: string) => Promise<SDAVacancy[]>
}

const STORAGE_KEY = 'carechoice.ask'
const TTL_MS = 24 * 60 * 60 * 1000 // 24h

interface PersistedShape {
  thread: AskMessage[]
  savedAt: number
}

function readPersisted(): AskMessage[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as PersistedShape
    if (!parsed?.savedAt || Date.now() - parsed.savedAt > TTL_MS) {
      window.localStorage.removeItem(STORAGE_KEY)
      return []
    }
    return Array.isArray(parsed.thread) ? parsed.thread : []
  } catch {
    return []
  }
}

function writePersisted(thread: AskMessage[]) {
  if (typeof window === 'undefined') return
  try {
    const payload: PersistedShape = { thread, savedAt: Date.now() }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
  } catch {
    // localStorage may be unavailable (Safari private mode etc.) — silently noop
  }
}

let idCounter = 0
function nextId(prefix: string) {
  idCounter += 1
  return `${prefix}-${Date.now().toString(36)}-${idCounter}`
}

async function defaultFetchVacancies(region?: string): Promise<SDAVacancy[]> {
  if (typeof window === 'undefined') return []
  try {
    const res = await fetch('/api/sda-vacancies')
    if (!res.ok) return []
    const data = (await res.json()) as { vacancies: SDAVacancy[] }
    const all = data.vacancies ?? []
    if (region) {
      const lower = region.toLowerCase()
      const filtered = all.filter((v) => {
        const haystack = `${v.region ?? ''} ${v.address.suburb ?? ''}`.toLowerCase()
        return haystack.includes(lower)
      })
      return (filtered.length > 0 ? filtered : all).slice(0, 3)
    }
    return all.slice(0, 3)
  } catch {
    return []
  }
}

export const useAskStore = create<AskState>((set, get) => ({
  open: false,
  thread: readPersisted(),
  demoAfterHours: false,
  pendingInput: '',

  openPanel: () => set({ open: true }),
  closePanel: () => set({ open: false }),
  togglePanel: () => set((s) => ({ open: !s.open })),
  setDemoAfterHours: (v) => set({ demoAfterHours: v }),
  setPendingInput: (v) => set({ pendingInput: v }),

  clear: () => {
    set({ thread: [] })
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.removeItem(STORAGE_KEY)
      } catch {
        /* noop */
      }
    }
  },

  submit: async (message: string) => {
    const trimmed = message.trim()
    if (!trimmed) return

    const userMessage: AskMessage = {
      id: nextId('u'),
      author: 'user',
      text: trimmed,
    }
    const typingMessage: AskMessage = {
      id: nextId('t'),
      author: 'agent',
      text: '',
      typing: true,
    }

    // Push user message + typing placeholder synchronously
    set((s) => {
      const next = [...s.thread, userMessage, typingMessage]
      writePersisted(next)
      return { thread: next, pendingInput: '' }
    })

    const response = routeIntent(trimmed, {
      now: new Date(),
      demoAfterHours: get().demoAfterHours,
    })

    let homes: SDAVacancy[] | undefined
    if (response.intent === 'homes') {
      const fetcher = get()._fetchVacancies ?? defaultFetchVacancies
      homes = await fetcher(response.homeLookup?.region)
    } else {
      // Mimic latency for believability — 800-1200ms
      const delay = 800 + Math.floor(Math.random() * 400)
      await new Promise((r) => setTimeout(r, delay))
    }

    const agentMessage: AskMessage = {
      id: nextId('a'),
      author: 'agent',
      text: response.text,
      sourceLinks: response.sourceLinks,
      followUpChips: response.followUpChips,
      homes,
      intent: response.intent,
    }

    // Replace the typing placeholder with the real reply
    set((s) => {
      const next = s.thread.map((m) => (m.id === typingMessage.id ? agentMessage : m))
      writePersisted(next)
      return { thread: next }
    })
  },
}))

// Exposed for tests
export const __STORE_INTERNALS = { STORAGE_KEY, TTL_MS, readPersisted, writePersisted }

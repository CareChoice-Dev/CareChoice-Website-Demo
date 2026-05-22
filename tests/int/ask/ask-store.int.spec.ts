import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { useAskStore, __STORE_INTERNALS } from '@/components/ask/ask-store'
import type { SDAVacancy } from '@/components/sda/types'

const { STORAGE_KEY, TTL_MS } = __STORE_INTERNALS

function resetStore() {
  // Reset to a clean state between tests.
  useAskStore.setState({
    open: false,
    thread: [],
    demoAfterHours: false,
    pendingInput: '',
    _fetchVacancies: undefined,
  })
}

describe('useAskStore — panel open/close', () => {
  beforeEach(() => {
    localStorage.clear()
    resetStore()
  })

  it('starts closed', () => {
    expect(useAskStore.getState().open).toBe(false)
  })

  it('openPanel() flips open to true', () => {
    useAskStore.getState().openPanel()
    expect(useAskStore.getState().open).toBe(true)
  })

  it('closePanel() returns to false', () => {
    useAskStore.getState().openPanel()
    useAskStore.getState().closePanel()
    expect(useAskStore.getState().open).toBe(false)
  })

  it('togglePanel() inverts open', () => {
    useAskStore.getState().togglePanel()
    expect(useAskStore.getState().open).toBe(true)
    useAskStore.getState().togglePanel()
    expect(useAskStore.getState().open).toBe(false)
  })

  it('setDemoAfterHours updates the flag', () => {
    useAskStore.getState().setDemoAfterHours(true)
    expect(useAskStore.getState().demoAfterHours).toBe(true)
  })
})

describe('useAskStore — submit() with mocked fetch', () => {
  beforeEach(() => {
    localStorage.clear()
    resetStore()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('submitting empty/whitespace is a no-op', async () => {
    await useAskStore.getState().submit('   ')
    expect(useAskStore.getState().thread.length).toBe(0)
  })

  it('submit() pushes a user message + replaces typing placeholder with agent reply for `service` intent', async () => {
    // Use fake timers so the latency delay doesn't actually block the test
    vi.useFakeTimers()
    const promise = useAskStore.getState().submit('What is SIL?')

    // After the synchronous push, the thread should contain [user, typing]
    let snapshot = useAskStore.getState().thread
    expect(snapshot.length).toBe(2)
    expect(snapshot[0].author).toBe('user')
    expect(snapshot[0].text).toBe('What is SIL?')
    expect(snapshot[1].author).toBe('agent')
    expect(snapshot[1].typing).toBe(true)

    // Advance through the 800-1200ms latency
    await vi.advanceTimersByTimeAsync(1500)
    await promise

    snapshot = useAskStore.getState().thread
    expect(snapshot.length).toBe(2)
    expect(snapshot[1].typing).toBeFalsy()
    expect(snapshot[1].text.length).toBeGreaterThan(0)
    expect(snapshot[1].intent).toBe('service')
  })

  it('submit() with homes intent calls the injected vacancy fetcher and attaches homes to the reply', async () => {
    const fakeHomes: SDAVacancy[] = [
      {
        id: 'a',
        name: 'Test home A',
        activeBeds: 4,
        occupiedBeds: 2,
        availableBeds: 2,
        address: {
          line1: '1 Test St',
          line2: null,
          suburb: 'Geelong',
          state: 'VIC',
          postcode: '3220',
          formatted: '1 Test St, Geelong VIC 3220',
        },
        geo: null,
        region: 'Geelong & Surf Coast',
        description: null,
        designStandard: 'Improved Liveability',
        propertyType: 'House',
        tenancyStatus: null,
        amenities: [],
        accessibility: [],
        sharepointUrl: null,
        photos: [],
      },
    ]
    const fetcher = vi.fn().mockResolvedValue(fakeHomes)
    useAskStore.setState({ _fetchVacancies: fetcher })

    await useAskStore.getState().submit('show me homes in Geelong')

    expect(fetcher).toHaveBeenCalledTimes(1)
    expect(fetcher).toHaveBeenCalledWith('Geelong')

    const snapshot = useAskStore.getState().thread
    const agentReply = snapshot[snapshot.length - 1]
    expect(agentReply.author).toBe('agent')
    expect(agentReply.intent).toBe('homes')
    expect(agentReply.homes?.length).toBe(1)
    expect(agentReply.homes?.[0].id).toBe('a')
  })
})

describe('useAskStore — localStorage persistence', () => {
  beforeEach(() => {
    localStorage.clear()
    resetStore()
  })

  it('writes thread to localStorage with savedAt timestamp', async () => {
    vi.useFakeTimers()
    const promise = useAskStore.getState().submit('What is SIL?')
    await vi.advanceTimersByTimeAsync(1500)
    await promise
    vi.useRealTimers()

    const raw = localStorage.getItem(STORAGE_KEY)
    expect(raw).toBeTruthy()
    const parsed = JSON.parse(raw!)
    expect(parsed.thread.length).toBe(2)
    expect(typeof parsed.savedAt).toBe('number')
  })

  it('drops persisted thread if older than TTL', () => {
    const stale = {
      thread: [{ id: 'x', author: 'user', text: 'old' }],
      savedAt: Date.now() - TTL_MS - 1000,
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stale))
    expect(__STORE_INTERNALS.readPersisted()).toEqual([])
    // Stale entry should be cleared as a side effect
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull()
  })

  it('returns persisted thread if fresh', () => {
    const fresh = {
      thread: [{ id: 'x', author: 'user' as const, text: 'hi' }],
      savedAt: Date.now() - 1000,
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh))
    const restored = __STORE_INTERNALS.readPersisted()
    expect(restored.length).toBe(1)
    expect(restored[0].text).toBe('hi')
  })

  it('clear() wipes thread and removes the localStorage entry', async () => {
    vi.useFakeTimers()
    const promise = useAskStore.getState().submit('What is SIL?')
    await vi.advanceTimersByTimeAsync(1500)
    await promise
    vi.useRealTimers()

    expect(localStorage.getItem(STORAGE_KEY)).toBeTruthy()
    useAskStore.getState().clear()
    expect(useAskStore.getState().thread.length).toBe(0)
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull()
  })
})

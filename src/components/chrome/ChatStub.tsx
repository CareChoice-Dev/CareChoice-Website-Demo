'use client'

import { useState } from 'react'

interface Turn {
  who: 'agent' | 'you'
  text: string
}

const SCRIPTED: Array<{ match: RegExp; reply: string }> = [
  {
    match: /sil|supported independent living/i,
    reply:
      "SIL — Supported Independent Living — is help to live as independently as possible in a shared home or your own home. It's funded under your NDIS plan. Would you like to see homes with vacancies?",
  },
  {
    match: /find a home|sda|available/i,
    reply:
      "We have 18 SDA homes across Victoria. The closest to you depends on your suburb. Have a look at /en/find-a-home — you can filter by region and design category.",
  },
  {
    match: /tac|worksafe/i,
    reply:
      "Yes — CareChoice supports TAC and WorkSafe participants too. The pathways differ from NDIS but the same care team and homes are available. I can connect you with our intake coordinator if you'd like.",
  },
  {
    match: /cost|price|how much/i,
    reply:
      "SDA homes are funded through your NDIS plan if you've been approved for SDA. SIL support is funded under Assistance with Daily Life. Specific weekly amounts depend on your individual plan — best to ask your support coordinator or get in touch via our enquiry form.",
  },
  {
    match: /enquir(y|e)|contact/i,
    reply:
      "You can make an enquiry at /en/enquiry or call us on 1300 737 942. A team member responds within one business day.",
  },
]

const FALLBACK_REPLY =
  "Thanks — I'll pass that to the team. In the meantime, you can make an enquiry at /en/enquiry or call 1300 737 942."

function reply(userText: string): string {
  for (const s of SCRIPTED) {
    if (s.match.test(userText)) return s.reply
  }
  return FALLBACK_REPLY
}

export function ChatStub() {
  const [open, setOpen] = useState(false)
  const [turns, setTurns] = useState<Turn[]>([
    { who: 'agent', text: "Hi. I'm the CareChoice assistant. Ask me about SDA homes, SIL, NDIS, or anything else." },
  ])
  const [input, setInput] = useState('')

  const send = () => {
    const trimmed = input.trim()
    if (!trimmed) return
    setTurns((t) => [...t, { who: 'you', text: trimmed }])
    setInput('')
    setTimeout(() => {
      setTurns((t) => [...t, { who: 'agent', text: reply(trimmed) }])
    }, 500)
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Close chat' : 'Open chat'}
        aria-expanded={open}
        className="fixed bottom-6 right-6 z-40 bg-cc-magenta text-white font-semibold border-2 border-cc-black px-5 py-3 rounded-none shadow-hard-card hover:-translate-x-[2px] hover:-translate-y-[2px] motion-reduce:transition-none"
      >
        {open ? 'Close.' : 'Chat. ▸'}
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Chat"
          className="fixed bottom-24 right-6 z-40 w-[360px] max-w-[calc(100vw-3rem)] bg-cc-white border-4 border-cc-black flex flex-col gap-0 shadow-hard-card"
        >
          <div className="bg-cc-magenta text-white p-3 font-bold border-b-2 border-cc-black flex justify-between items-center">
            <span>CareChoice assistant.</span>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close" className="text-white">✕</button>
          </div>
          <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2 text-sm" style={{ maxHeight: 360 }}>
            {turns.map((t, i) => (
              <div
                key={i}
                className={t.who === 'agent'
                  ? 'self-start bg-cc-surface-pink p-2 border-2 border-cc-black max-w-[280px]'
                  : 'self-end bg-cc-black text-white p-2 border-2 border-cc-black max-w-[280px]'}
              >
                {t.text}
              </div>
            ))}
          </div>
          <form
            onSubmit={(e) => { e.preventDefault(); send() }}
            className="flex border-t-2 border-cc-black"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question…"
              className="flex-1 px-3 py-2 border-r-2 border-cc-black focus:outline-none"
              aria-label="Your message"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-cc-magenta text-white font-semibold"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </>
  )
}

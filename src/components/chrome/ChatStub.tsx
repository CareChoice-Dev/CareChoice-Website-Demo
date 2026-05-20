'use client'

import { useState } from 'react'

export function ChatStub() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Close chat preview' : 'Open chat preview'}
        aria-expanded={open}
        className="fixed bottom-6 right-6 z-40 bg-cc-magenta text-white font-semibold border-2 border-cc-black px-5 py-3 rounded-none shadow-hard-card hover:-translate-x-[2px] hover:-translate-y-[2px] motion-reduce:transition-none"
      >
        {open ? 'Close.' : 'Chat. ▸'}
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Chat preview"
          className="fixed bottom-24 right-6 z-40 w-[320px] max-w-[calc(100vw-3rem)] bg-cc-white border-4 border-cc-black p-4 flex flex-col gap-3 shadow-hard-card"
        >
          <p className="font-bold">Hi there.</p>
          <p className="text-sm">
            The real Agentforce assistant lands in Week 5 of the build. This is the placeholder
            so the layout slot is reserved.
          </p>
        </div>
      )}
    </>
  )
}

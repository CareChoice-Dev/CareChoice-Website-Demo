'use client'

import { useEffect, useRef } from 'react'
import NextLink from 'next/link'
import Image from 'next/image'
import { AskCCSourceCard } from './AskCCSourceCard'
import type { AskMessage } from './ask-store'

export interface AskCCMessageListProps {
  thread: AskMessage[]
  hrefPrefix: string
  /** Called when a follow-up chip is clicked. */
  onChip: (text: string) => void
}

/**
 * Renders the conversation bubble list. Agent bubbles are surface-pink on the left;
 * user bubbles are black on the right. Auto-scrolls to the latest message on update.
 */
export function AskCCMessageList({ thread, hrefPrefix, onChip }: AskCCMessageListProps) {
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // scrollIntoView is not implemented in jsdom — guard for tests.
    if (typeof endRef.current?.scrollIntoView === 'function') {
      endRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' })
    }
  }, [thread])

  return (
    <div
      role="log"
      aria-live="polite"
      aria-label="Ask CareChoice conversation"
      className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3 text-sm"
    >
      {thread.length === 0 && (
        <div className="bg-cc-surface-pink border-2 border-cc-black p-3 self-start max-w-[85%]">
          <p className="font-bold mb-1">CareChoice Assistant.</p>
          <p>
            Hi. I can help with finding a home, learning about our services, talking to our team,
            or starting an enquiry. What&apos;s on your mind?
          </p>
        </div>
      )}

      {thread.map((m) => (
        <MessageBubble
          key={m.id}
          message={m}
          hrefPrefix={hrefPrefix}
          onChip={onChip}
        />
      ))}

      <div ref={endRef} />
    </div>
  )
}

function MessageBubble({
  message,
  hrefPrefix,
  onChip,
}: {
  message: AskMessage
  hrefPrefix: string
  onChip: (text: string) => void
}) {
  if (message.author === 'user') {
    return (
      <div className="self-end bg-cc-black text-white p-3 border-2 border-cc-black max-w-[85%] break-words">
        {message.text}
      </div>
    )
  }

  if (message.typing) {
    return (
      <div className="self-start bg-cc-surface-pink border-2 border-cc-black p-3 max-w-[60%]" aria-label="Assistant is typing">
        <span className="inline-flex gap-1" aria-hidden>
          <span className="w-2 h-2 bg-cc-black rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-2 h-2 bg-cc-black rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="w-2 h-2 bg-cc-black rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </span>
      </div>
    )
  }

  return (
    <div className="self-start max-w-[90%] flex flex-col gap-2">
      <div className="bg-cc-surface-pink border-2 border-cc-black p-3 break-words">
        {message.text}
      </div>

      {message.homes && message.homes.length > 0 && (
        <div className="flex flex-col gap-2">
          {message.homes.map((h) => (
            <NextLink
              key={h.id}
              href={`${hrefPrefix}/find-a-home/${h.id}`}
              className="flex gap-3 items-center bg-cc-white border-2 border-cc-black p-2 no-underline transition-transform duration-[0.15s] ease-out hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-hard-card focus-visible:outline-2 focus-visible:outline-cc-magenta focus-visible:outline-offset-2 motion-reduce:transition-none"
            >
              <div className="relative w-16 h-16 bg-cc-surface-pink border-2 border-cc-black flex-shrink-0 flex items-center justify-center overflow-hidden">
                {h.photos[0]?.url ? (
                  <Image
                    src={h.photos[0].url}
                    alt={h.photos[0].alt || h.name}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                ) : (
                  <span className="text-[10px] text-cc-fg-muted">Photo TBA</span>
                )}
              </div>
              <div className="flex flex-col flex-1 min-w-0">
                <p className="font-bold leading-tight text-cc-black truncate">{h.name}</p>
                {h.address.formatted && (
                  <p className="text-xs text-cc-fg-muted truncate">{h.address.formatted}</p>
                )}
                <p className="text-xs font-semibold mt-0.5">
                  {h.availableBeds === 0
                    ? 'Currently full.'
                    : `${h.availableBeds} bed${h.availableBeds === 1 ? '' : 's'} available.`}
                </p>
              </div>
              <span aria-hidden className="text-cc-magenta">→</span>
            </NextLink>
          ))}
        </div>
      )}

      {message.sourceLinks && message.sourceLinks.length > 0 && (
        <div className="flex flex-col gap-2">
          {message.sourceLinks.map((src) => (
            <AskCCSourceCard
              key={src.href + src.label}
              label={src.label}
              href={`${hrefPrefix}${src.href}`}
              description={src.description}
            />
          ))}
        </div>
      )}

      {message.followUpChips && message.followUpChips.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-1">
          {message.followUpChips.map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => onChip(chip)}
              className="text-xs font-semibold px-2 py-1 border-2 border-cc-black bg-cc-white text-cc-black hover:bg-cc-surface-pink transition-colors motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-cc-magenta focus-visible:outline-offset-2"
            >
              {chip}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

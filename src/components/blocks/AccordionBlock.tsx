'use client'

import { useState, type ReactNode } from 'react'
import { ChevronDown } from 'lucide-react'

export interface AccordionItem {
  id: string
  heading: string
  body: ReactNode
}

export function AccordionBlock({ items }: { items: AccordionItem[] }) {
  const [openId, setOpenId] = useState<string | null>(null)

  return (
    <div className="flex flex-col gap-0">
      {items.map((item) => {
        const isOpen = openId === item.id
        return (
          <div key={item.id} className="border-2 border-cc-black -mt-[2px] first:mt-0 bg-cc-white">
            <h3>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={`panel-${item.id}`}
                onClick={() => setOpenId(isOpen ? null : item.id)}
                className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left text-lg font-bold hover:bg-cc-surface-pink"
              >
                <span>{item.heading}</span>
                <ChevronDown
                  className={`w-5 h-5 transition-transform duration-[0.18s] ${isOpen ? 'rotate-180' : ''} motion-reduce:transition-none`}
                  aria-hidden="true"
                />
              </button>
            </h3>
            {isOpen && (
              <div
                id={`panel-${item.id}`}
                className="px-5 pb-5 pt-2 border-t-2 border-cc-black text-base leading-relaxed"
              >
                {item.body}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

'use client'

import { usePathname, useRouter } from 'next/navigation'
import { swapLocaleInPath, isEasyReadPath } from '@/lib/easy-read'

export function EasyReadToggle() {
  const router = useRouter()
  const pathname = usePathname()
  const isActive = isEasyReadPath(pathname)

  const onClick = () => {
    const target = isActive ? 'en' : 'easy-read'
    router.push(swapLocaleInPath(pathname, target))
  }

  return (
    <button
      type="button"
      aria-pressed={isActive}
      onClick={onClick}
      className={`h-[36px] px-3 border-2 border-cc-black font-semibold ${
        isActive ? 'bg-cc-magenta text-white' : 'bg-white text-cc-black hover:bg-cc-surface-pink'
      }`}
    >
      Easy Read
    </button>
  )
}

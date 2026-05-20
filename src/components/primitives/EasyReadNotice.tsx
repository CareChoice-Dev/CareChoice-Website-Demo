import { Module } from './Module'

export function EasyReadNotice({ pageName }: { pageName?: string }) {
  return (
    <Module fill="surface-pink" weight="card" className="p-4 max-w-prose">
      <p className="font-semibold text-base">
        Easy Read for {pageName ?? 'this page'} is coming soon.
      </p>
      <p className="text-sm mt-1">
        We are writing this page in Easy Read. Until it is ready, you are seeing the regular version.
        You can switch back any time.
      </p>
    </Module>
  )
}

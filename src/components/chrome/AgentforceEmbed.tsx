import { AskCC } from '@/components/ask/AskCC'
import { AskCCTrigger } from '@/components/ask/AskCCTrigger'

/**
 * Global Ask CareChoice mount point. Renders the slide-out panel + the floating trigger
 * button. The component name ("AgentforceEmbed") is preserved for layout import-path
 * compatibility — the panel is branded "Powered by Agentforce" at its footer, but no
 * real Agentforce backend exists yet. Replies come from the local intent router in
 * `src/components/ask/ask-intents.ts`.
 *
 * The legacy SiteSettings agentforce config (deploymentId / orgId) has been removed —
 * those fields were aspirational and not wired into a real ESW deployment.
 */
export function AgentforceEmbed() {
  return (
    <>
      <AskCC />
      <AskCCTrigger variant="floating" />
    </>
  )
}

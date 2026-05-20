import {
  Accessibility,
  Bell,
  DoorOpen,
  Bath,
  Bed,
  Wifi,
  ParkingSquare,
  Wind,
  Sun,
  ShieldCheck,
  type LucideIcon,
} from 'lucide-react'
import { Module } from '@/components/primitives/Module'

const ICON_MAP: Array<{ match: RegExp; icon: LucideIcon; label: string }> = [
  { match: /sleepover/i, icon: Bed, label: 'Sleepover support' },
  { match: /zoned rooms?/i, icon: DoorOpen, label: 'Zoned rooms' },
  { match: /distress alarms?/i, icon: Bell, label: 'Distress alarms' },
  { match: /hoist/i, icon: Accessibility, label: 'Hoist mounts' },
  { match: /bath|shower/i, icon: Bath, label: 'Accessible bathroom' },
  { match: /wide door/i, icon: DoorOpen, label: 'Wide doorways' },
  { match: /wifi|internet/i, icon: Wifi, label: 'WiFi included' },
  { match: /parking/i, icon: ParkingSquare, label: 'Off-street parking' },
  { match: /air[- ]?con|cooling|heating/i, icon: Wind, label: 'Heating & cooling' },
  { match: /outdoor|garden/i, icon: Sun, label: 'Outdoor space' },
  { match: /secure|safe/i, icon: ShieldCheck, label: 'Secure entry' },
]

function classify(item: string): { icon: LucideIcon; label: string } {
  const match = ICON_MAP.find((m) => m.match.test(item))
  return match
    ? { icon: match.icon, label: match.label }
    : { icon: Accessibility, label: item }
}

export function AccessibilityFeaturesGrid({
  amenities,
  accessibility,
}: {
  amenities: string[]
  accessibility: string[]
}) {
  const all = Array.from(new Set([...amenities, ...accessibility].filter(Boolean)))
  if (all.length === 0) {
    return (
      <p className="text-base text-cc-fg-muted">
        Detailed accessibility features for this home are being added by our team.
      </p>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {all.map((item) => {
        const { icon: Icon, label } = classify(item)
        return (
          <Module key={item} weight="card" className="p-4 flex items-center gap-3">
            <Icon className="w-8 h-8 shrink-0" strokeWidth={1.75} aria-hidden="true" />
            <span className="text-base font-semibold">{label}</span>
          </Module>
        )
      })}
    </div>
  )
}

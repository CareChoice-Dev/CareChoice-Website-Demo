import { Module } from '@/components/primitives/Module'

const SUBURB_BLURBS: Record<string, string> = {
  'Mount Duneed': 'Quiet outer-Geelong suburb with new builds, parks, and easy access to the Surf Coast Highway.',
  'Mickleham': 'Growing northern-Melbourne community with new schools, shops, and an emerging town centre.',
  'Wyndham Vale': 'Family-oriented western suburb with rail to the city and broad open space along the Werribee River.',
  'Point Cook': 'Bayside western Melbourne with strong community amenities, walkable streets, and a regional hospital.',
  'Bayswater': 'Established eastern Melbourne suburb on the Belgrave train line with shops and parklands.',
  'Werribee': 'Major western Melbourne hub with hospital, university campus, and direct city rail.',
  'Ascot': 'Inland suburb near Bendigo with quiet streets and access to regional services.',
  'Keysborough': 'Southeastern suburb with parkland, shopping centres, and Monash Children’s Hospital nearby.',
  'Sunshine North': 'Western Melbourne with strong public-transport links and a vibrant multicultural community.',
  'Frankston': 'Bayside city on the Mornington Peninsula line with beach access and growing health precinct.',
  'Coburg': 'Inner-northern Melbourne with the Upfield train line, food culture, and Merri Creek parklands.',
  'Footscray': 'Inner-western Melbourne with strong rail links, restaurants, Victoria University, and Footscray Hospital.',
  'St Kilda': 'Bayside inner Melbourne, walking distance to the beach, with strong tram coverage.',
  'Brunswick': 'Inner-northern Melbourne with the Upfield line, Sydney Road retail, and a creative community.',
  'Geelong': 'Victoria’s second-largest city, with hospitals, regional services, and the Surf Coast nearby.',
}

export function SuburbContextBlock({ suburb }: { suburb: string | null }) {
  if (!suburb) return null
  const blurb = SUBURB_BLURBS[suburb] ??
    `${suburb} is one of the local communities we support.`

  return (
    <Module weight="card" className="p-6 flex flex-col gap-2">
      <span className="eyebrow">About {suburb}.</span>
      <p className="text-base leading-relaxed max-w-prose">{blurb}</p>
    </Module>
  )
}

'use client'

import { useField } from '@payloadcms/ui'
import { useEffect, useState } from 'react'

interface SDAOption {
  id: string
  name: string
}

interface FieldProps {
  path: string
}

/**
 * Custom admin field for SDAPhotos.siteId.
 *
 * Fetches the live SDA vacancies list from `/api/sda-vacancies` and renders
 * it as a dropdown. The selected Salesforce Id is written to the `siteId`
 * field; the matching `siteName` is filled in server-side by a beforeChange
 * hook on the SDAPhotos collection (see SDAPhotos.ts) — this avoids
 * cross-field-write fragility across Payload 3.x versions.
 */
export function SDAPhotoSitePickerField({ path }: FieldProps) {
  const { value, setValue } = useField<string>({ path })
  const [options, setOptions] = useState<SDAOption[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const res = await fetch('/api/sda-vacancies')
        if (!res.ok) {
          if (!cancelled) setError(`Could not load sites (HTTP ${res.status}).`)
          return
        }
        const data: { vacancies: Array<{ id: string; name: string }> } = await res.json()
        if (!cancelled) {
          setOptions(
            data.vacancies
              .map((v) => ({ id: v.id, name: v.name }))
              .sort((a, b) => a.name.localeCompare(b.name)),
          )
        }
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load sites.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="field-type" style={{ marginBottom: '1.5rem' }}>
      <label className="field-label" htmlFor={path}>
        Salesforce Site <span style={{ color: '#c00' }}>*</span>
      </label>
      {loading ? (
        <p style={{ fontSize: 13, color: '#777' }}>Loading sites from Salesforce…</p>
      ) : error ? (
        <p style={{ fontSize: 13, color: '#c00' }}>{error}</p>
      ) : (
        <select
          id={path}
          value={value ?? ''}
          onChange={(e) => setValue(e.target.value)}
          style={{
            width: '100%',
            padding: 8,
            border: '1px solid #ccc',
            borderRadius: 4,
            background: '#fff',
          }}
        >
          <option value="">— Choose a site —</option>
          {options.map((o) => (
            <option key={o.id} value={o.id}>
              {o.name}
            </option>
          ))}
        </select>
      )}
      <p style={{ fontSize: 13, color: '#777', marginTop: 4 }}>
        Pick a site from Salesforce. The list refreshes whenever /admin loads. The
        site name will be auto-filled on save.
      </p>
    </div>
  )
}

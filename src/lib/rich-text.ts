import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

/** Guard: Payload may store richText as null/undefined when never edited. */
export function hasRichTextContent(value: unknown): value is SerializedEditorState {
  if (!value || typeof value !== 'object') return false
  return 'root' in value
}

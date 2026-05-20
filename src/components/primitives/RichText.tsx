import { RichText as PayloadRichText } from '@payloadcms/richtext-lexical/react'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import { cn } from '@/lib/cn'
import { hasRichTextContent } from '@/lib/rich-text'

export interface RichTextProps {
  value: unknown
  className?: string
}

export function RichText({ value, className }: RichTextProps) {
  if (!hasRichTextContent(value)) return null

  return (
    <div
      className={cn(
        'max-w-prose',
        '[&_h2]:text-3xl [&_h2]:font-bold [&_h2]:leading-tight [&_h2]:tracking-tight [&_h2]:mt-10 [&_h2]:mb-4',
        '[&_h3]:text-2xl [&_h3]:font-bold [&_h3]:mt-8 [&_h3]:mb-3',
        '[&_p]:text-base [&_p]:leading-relaxed [&_p]:mb-4',
        '[&_a]:underline [&_a:hover]:text-cc-pms-675',
        '[&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4',
        '[&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4',
        '[&_li]:mb-1',
        '[&_blockquote]:border-l-4 [&_blockquote]:border-cc-magenta [&_blockquote]:pl-4 [&_blockquote]:italic',
        className,
      )}
    >
      <PayloadRichText data={value as SerializedEditorState} />
    </div>
  )
}

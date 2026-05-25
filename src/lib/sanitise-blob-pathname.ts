/**
 * Vercel Blob's PUT endpoint at `vercel.com/api/blob/?pathname=...` validates
 * the inbound pathname and rejects spaces, parentheses, `#`, `?`, and other
 * URL-special characters with a 400 — regardless of the `addRandomSuffix`
 * flag (which only governs what Vercel does after the file is accepted).
 *
 * Sanitise the pathname before token generation so any user-supplied filename
 * (including OS-generated names like `Media (2).jpeg`) survives the round trip.
 *
 * Preserves Unicode letters/digits (so VI/ZH photo filenames keep their
 * native script), forward slashes (Payload prefixes), periods, hyphens,
 * and underscores. Everything else collapses to `_`.
 */
export function sanitiseBlobPathname(input: string): string {
  if (!input) return 'file'

  let out = input.normalize('NFKC').replace(/[^\p{L}\p{N}._\-\/]/gu, '_')
  out = out.replace(/_+/g, '_')
  out = out.replace(/_+(?=[.\/])/g, '')
  out = out
    .split('/')
    .map((seg) => seg.replace(/^[._\-]+|[._\-]+$/g, ''))
    .filter(Boolean)
    .join('/')

  return out || 'file'
}

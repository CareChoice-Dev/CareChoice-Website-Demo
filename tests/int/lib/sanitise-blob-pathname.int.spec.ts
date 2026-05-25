import { describe, it, expect } from 'vitest'
import { sanitiseBlobPathname } from '@/lib/sanitise-blob-pathname'

describe('sanitiseBlobPathname', () => {
  it('replaces spaces with underscores', () => {
    expect(sanitiseBlobPathname('SDA Options Maintenance QR Code.png')).toBe(
      'SDA_Options_Maintenance_QR_Code.png',
    )
  })

  it('strips parentheses and the run-of-underscores artefact before the extension', () => {
    expect(sanitiseBlobPathname('Media (2).jpeg')).toBe('Media_2.jpeg')
  })

  it('leaves an already-safe filename alone', () => {
    expect(sanitiseBlobPathname('carechoice-logo.svg')).toBe('carechoice-logo.svg')
  })

  it('preserves multi-part extensions', () => {
    expect(sanitiseBlobPathname('archive.tar.gz')).toBe('archive.tar.gz')
  })

  it('strips a mix of URL-special characters', () => {
    expect(sanitiseBlobPathname('Document (final) #2 v3.docx')).toBe(
      'Document_final_2_v3.docx',
    )
  })

  it('preserves forward slashes for prefixed paths', () => {
    expect(sanitiseBlobPathname('media/photos/My Shot.jpg')).toBe(
      'media/photos/My_Shot.jpg',
    )
  })

  it('preserves Unicode letters and digits', () => {
    expect(sanitiseBlobPathname('测试文档.pdf')).toBe('测试文档.pdf')
    expect(sanitiseBlobPathname('Tài liệu.pdf')).toBe('Tài_liệu.pdf')
  })

  it('trims leading punctuation runs in each segment', () => {
    expect(sanitiseBlobPathname('   spaces around.png   ')).toBe('spaces_around.png')
    expect(sanitiseBlobPathname('---leading.png')).toBe('leading.png')
  })

  it('collapses runs of replaced characters', () => {
    expect(sanitiseBlobPathname('a   b @@@ c.png')).toBe('a_b_c.png')
  })

  it('falls back to "file" when the input is empty or fully stripped', () => {
    expect(sanitiseBlobPathname('')).toBe('file')
    expect(sanitiseBlobPathname('@@@')).toBe('file')
  })
})

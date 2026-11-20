import { describe, expect, it } from 'vitest'
import { cleanText, createTitle, splitTextIntoChunks } from '../src/utils/text'

describe('cleanText', () => {
  it('normalizes line endings and excess whitespace without removing paragraphs', () => {
    expect(cleanText('  First   line\r\n\r\n\r\nSecond\tline  ')).toBe(
      'First line\n\nSecond line',
    )
  })
})

describe('splitTextIntoChunks', () => {
  it('returns no chunks for empty input and keeps every word for long text', () => {
    expect(splitTextIntoChunks('')).toEqual([])

    const source = `${'a sentence with several words. '.repeat(30)}ending`
    const chunks = splitTextIntoChunks(source, 35)

    expect(chunks.length).toBeGreaterThan(1)
    expect(chunks.every((chunk) => chunk.text.length <= 35)).toBe(true)
    expect(chunks.map((chunk) => chunk.text).join(' ')).toBe(source.trim())
  })

  it('rejects unusable chunk limits', () => {
    expect(() => splitTextIntoChunks('words', 0)).toThrow(RangeError)
  })
})

describe('createTitle', () => {
  it('uses the first line and caps long titles', () => {
    expect(createTitle('A clear title\nMore content')).toBe('A clear title')
    expect(createTitle('x'.repeat(70))).toBe(`${'x'.repeat(53)}...`)
    expect(createTitle(' \nMore content')).toBe('Untitled text')
  })
})

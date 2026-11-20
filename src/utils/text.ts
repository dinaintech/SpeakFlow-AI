import type { SpeechChunk } from '../types'

export function cleanText(text: string): string {
  return text
    .replace(/\r\n?/g, '\n')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

export function splitTextIntoChunks(
  text: string,
  maxLength = 1400,
): SpeechChunk[] {
  if (!Number.isInteger(maxLength) || maxLength < 1) {
    throw new RangeError('Chunk length must be a positive integer.')
  }

  const chunks: SpeechChunk[] = []
  let start = 0

  while (start < text.length) {
    let end = Math.min(start + maxLength, text.length)

    if (end < text.length) {
      const candidates = [
        text.lastIndexOf(' ', end),
        text.lastIndexOf('\n', end),
        text.lastIndexOf('\t', end),
      ]
      const boundary = Math.max(...candidates)

      if (boundary > start + Math.floor(maxLength * 0.6)) {
        end = boundary
      }
    }

    const rawChunk = text.slice(start, end)
    const leadingWhitespace = rawChunk.length - rawChunk.trimStart().length
    const chunk = rawChunk.trim()

    if (chunk) {
      chunks.push({ text: chunk, startIndex: start + leadingWhitespace })
    }

    start = end
  }

  return chunks
}

export function createTitle(text: string): string {
  const firstLine = text.split(/\r?\n/, 1)[0]?.trim() ?? ''
  if (!firstLine) return 'Untitled text'
  return firstLine.length > 56 ? `${firstLine.slice(0, 53).trimEnd()}...` : firstLine
}

export function formatRelativeDate(date: string): string {
  const timestamp = new Date(date).getTime()
  if (!Number.isFinite(timestamp)) return 'Unknown date'

  const elapsedMinutes = Math.max(0, Math.floor((Date.now() - timestamp) / 60_000))
  if (elapsedMinutes < 1) return 'Just now'
  if (elapsedMinutes < 60) return `${elapsedMinutes} min ago`

  const elapsedHours = Math.floor(elapsedMinutes / 60)
  if (elapsedHours < 24) return `${elapsedHours} hr ago`

  const elapsedDays = Math.floor(elapsedHours / 24)
  if (elapsedDays < 7) return `${elapsedDays} day${elapsedDays === 1 ? '' : 's'} ago`

  return new Date(timestamp).toLocaleDateString()
}

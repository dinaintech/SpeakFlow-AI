import type { HistoryEntry, SavedText } from '../types'

const SAVED_KEY = 'speakflow.saved.v1'
const HISTORY_KEY = 'speakflow.history.v1'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isSavedText(value: unknown): value is SavedText {
  return (
    isRecord(value) &&
    typeof value.id === 'string' &&
    typeof value.title === 'string' &&
    typeof value.text === 'string' &&
    typeof value.createdAt === 'string'
  )
}

function isHistoryEntry(value: unknown): value is HistoryEntry {
  return (
    isRecord(value) &&
    typeof value.id === 'string' &&
    typeof value.title === 'string' &&
    typeof value.text === 'string' &&
    typeof value.playedAt === 'string'
  )
}

function readItems<T>(
  key: string,
  isItem: (value: unknown) => value is T,
): T[] {
  try {
    const raw = window.localStorage.getItem(key)
    if (raw === null) return []

    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed) || !parsed.every(isItem)) {
      throw new Error('Stored data has an unexpected format.')
    }

    return parsed
  } catch (error) {
    throw new Error(
      'SpeakFlow could not read saved data from this browser. Check your browser storage settings and reload.',
      { cause: error },
    )
  }
}

function writeItems<T>(key: string, items: T[]): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(items))
  } catch (error) {
    throw new Error(
      'SpeakFlow could not save data. Your browser storage may be full or disabled.',
      { cause: error },
    )
  }
}

export const storageService = {
  loadSavedTexts: () => readItems(SAVED_KEY, isSavedText),
  loadHistory: () => readItems(HISTORY_KEY, isHistoryEntry),
  saveSavedTexts: (items: SavedText[]) => writeItems(SAVED_KEY, items),
  saveHistory: (items: HistoryEntry[]) => writeItems(HISTORY_KEY, items),
}

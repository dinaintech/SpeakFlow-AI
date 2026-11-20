export type AppView = 'reader' | 'saved' | 'history'

export type SpeechStatus = 'idle' | 'speaking' | 'paused'

export type LanguageOption = {
  code: string
  label: string
  shortLabel: string
}

export type SavedText = {
  id: string
  title: string
  text: string
  createdAt: string
}

export type HistoryEntry = {
  id: string
  title: string
  text: string
  playedAt: string
}

export type SpeechChunk = {
  text: string
  startIndex: number
}

import { useCallback, useState } from 'react'
import { DashboardPage } from './pages/DashboardPage'
import { useSpeech } from './hooks/useSpeech'
import { storageService } from './services/storageService'
import { getSpeechSynthesis } from './services/speechService'
import type {
  AppView,
  HistoryEntry,
  LanguageOption,
  SavedText,
} from './types'
import { cleanText, createTitle } from './utils/text'
import './styles/index.css'

const INITIAL_LANGUAGE: LanguageOption = {
  code: 'en-US',
  label: 'English',
  shortLabel: 'EN',
}

const SAMPLE_TEXT: Record<string, string> = {
  'en-US': 'The best ideas often arrive when we give ourselves a little room to think. A short walk, a quiet moment, or simply listening can help us see familiar things in a new way.\n\nTake your time. You do not have to read every word at once.',
  'ru-RU': 'Лучшие идеи часто приходят, когда мы даём себе немного времени подумать. Короткая прогулка, спокойная пауза или возможность просто слушать помогают увидеть привычные вещи по-новому.\n\nНе торопитесь. Не обязательно читать всё сразу.',
  'kk-KZ': 'Жақсы ойлар көбіне ойлануға уақыт бөлген кезде келеді. Қысқа серуен, тыныш сәт немесе жай ғана тыңдау таныс нәрселерге жаңаша қарауға көмектеседі.\n\nАсықпаңыз. Барлығын бірден оқудың қажеті жоқ.',
}

function createId(): string {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

export default function App() {
  const [activeView, setActiveView] = useState<AppView>('reader')
  const [text, setText] = useState('')
  const [language, setLanguage] = useState(INITIAL_LANGUAGE)
  const [selectedVoiceURI, setSelectedVoiceURI] = useState('')
  const [rate, setRate] = useState(1)
  const [initialData] = useState(() => {
    try {
      return {
        savedTexts: storageService.loadSavedTexts(),
        history: storageService.loadHistory(),
        error: null,
      }
    } catch (loadError) {
      return {
        savedTexts: [] as SavedText[],
        history: [] as HistoryEntry[],
        error: loadError instanceof Error ? loadError.message : 'Saved data could not be loaded.',
      }
    }
  })
  const [savedTexts, setSavedTexts] = useState(initialData.savedTexts)
  const [history, setHistory] = useState(initialData.history)
  const [appError, setAppError] = useState<string | null>(initialData.error)
  const speech = useSpeech()
  const error = speech.error ?? appError
  const languageVoices = speech.voices.filter((voice) =>
    voice.lang.toLowerCase().startsWith(language.code.slice(0, 2).toLowerCase()),
  )
  const effectiveVoiceURI = languageVoices.some((voice) => voice.voiceURI === selectedVoiceURI)
    ? selectedVoiceURI
    : languageVoices.find((voice) => voice.default)?.voiceURI ?? ''
  const {
    status: speechStatus,
    play,
    pause,
    resume,
    stop,
    clearError,
  } = speech
  const stopIfActive = useCallback(() => {
    if (speechStatus !== 'idle') stop()
  }, [speechStatus, stop])

  const saveSavedTexts = useCallback((next: SavedText[]) => {
    try {
      storageService.saveSavedTexts(next)
      setSavedTexts(next)
      setAppError(null)
    } catch (saveError) {
      setAppError(saveError instanceof Error ? saveError.message : 'Your saved text could not be updated.')
    }
  }, [])

  const saveHistory = useCallback((next: HistoryEntry[]) => {
    try {
      storageService.saveHistory(next)
      setHistory(next)
      setAppError(null)
    } catch (saveError) {
      setAppError(saveError instanceof Error ? saveError.message : 'Your listening history could not be updated.')
    }
  }, [])

  const handlePlay = useCallback(() => {
    const preparedText = text.trim()
    play(preparedText, language.code, effectiveVoiceURI, rate)
    if (!preparedText || !getSpeechSynthesis()) return

    const entry: HistoryEntry = {
      id: createId(),
      title: createTitle(preparedText),
      text: preparedText,
      playedAt: new Date().toISOString(),
    }
    saveHistory([entry, ...history].slice(0, 30))
    setActiveView('reader')
  }, [effectiveVoiceURI, history, language.code, play, rate, saveHistory, text])

  const handleSave = useCallback(() => {
    const preparedText = text.trim()
    if (!preparedText) return

    const existing = savedTexts.find((item) => item.text === preparedText)
    if (existing) {
      saveSavedTexts(savedTexts.filter((item) => item.id !== existing.id))
      return
    }

    const entry: SavedText = {
      id: createId(),
      title: createTitle(preparedText),
      text: preparedText,
      createdAt: new Date().toISOString(),
    }
    saveSavedTexts([entry, ...savedTexts])
  }, [saveSavedTexts, savedTexts, text])

  const handleCopy = useCallback(async (value: string) => {
    try {
      if (!navigator.clipboard?.writeText) {
        throw new Error('Clipboard access is unavailable in this browser.')
      }
      await navigator.clipboard.writeText(value)
      setAppError(null)
    } catch (copyError) {
      setAppError(copyError instanceof Error ? copyError.message : 'The text could not be copied.')
    }
  }, [])

  const handleDelete = useCallback((id: string) => {
    saveSavedTexts(savedTexts.filter((item) => item.id !== id))
  }, [saveSavedTexts, savedTexts])

  const handleLoadText = useCallback((value: string) => {
    stopIfActive()
    setText(value)
    setActiveView('reader')
    setAppError(null)
  }, [stopIfActive])

  const handleClean = useCallback(() => {
    stopIfActive()
    setText(cleanText(text))
  }, [stopIfActive, text])

  const handleUseSample = useCallback(() => {
    stopIfActive()
    setText(SAMPLE_TEXT[language.code] ?? SAMPLE_TEXT['en-US'] ?? '')
  }, [language.code, stopIfActive])

  const handleLanguageChange = useCallback((nextLanguage: LanguageOption) => {
    stopIfActive()
    setLanguage(nextLanguage)
    setSelectedVoiceURI('')
  }, [stopIfActive])

  const handleTextChange = useCallback((value: string) => {
    stopIfActive()
    setText(value)
  }, [stopIfActive])

  const dismissError = useCallback(() => {
    setAppError(null)
    clearError()
  }, [clearError])

  return (
    <DashboardPage
      activeView={activeView}
      text={text}
      language={language}
      selectedVoiceURI={effectiveVoiceURI}
      voices={speech.voices}
      status={speech.status}
      progress={speech.progress}
      currentWord={speech.currentWord}
      currentChunk={speech.currentChunk}
      totalChunks={speech.totalChunks}
      savedTexts={savedTexts}
      history={history}
      error={error}
      onChangeView={setActiveView}
      onTextChange={handleTextChange}
      onLanguageChange={handleLanguageChange}
      onVoiceChange={setSelectedVoiceURI}
      onRateChange={setRate}
      onClean={handleClean}
      onUseSample={handleUseSample}
      onPlay={handlePlay}
      onPause={pause}
      onResume={resume}
      onStop={stop}
      onSave={handleSave}
      onCopy={handleCopy}
      onLoadText={handleLoadText}
      onDelete={handleDelete}
      onDismissError={dismissError}
    />
  )
}

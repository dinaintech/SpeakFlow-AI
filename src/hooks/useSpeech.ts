import { useCallback, useEffect, useRef, useState } from 'react'
import type { SpeechStatus } from '../types'
import { splitTextIntoChunks } from '../utils/text'
import { getAvailableVoices, getSpeechSynthesis } from '../services/speechService'

type UseSpeechResult = {
  voices: SpeechSynthesisVoice[]
  status: SpeechStatus
  progress: number
  currentWord: string | null
  currentChunk: number
  totalChunks: number
  error: string | null
  play: (text: string, languageCode: string, voiceURI: string, rate: number) => void
  pause: () => void
  resume: () => void
  stop: () => void
  clearError: () => void
}

export function useSpeech(): UseSpeechResult {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const [status, setStatus] = useState<SpeechStatus>('idle')
  const [progress, setProgress] = useState(0)
  const [currentWord, setCurrentWord] = useState<string | null>(null)
  const [currentChunk, setCurrentChunk] = useState(0)
  const [totalChunks, setTotalChunks] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const sessionRef = useRef(0)

  useEffect(() => {
    const synthesis = getSpeechSynthesis()
    if (!synthesis) return

    const updateVoices = () => setVoices(getAvailableVoices())
    updateVoices()
    synthesis.addEventListener('voiceschanged', updateVoices)

    return () => synthesis.removeEventListener('voiceschanged', updateVoices)
  }, [])

  const stop = useCallback(() => {
    sessionRef.current += 1
    getSpeechSynthesis()?.cancel()
    setStatus('idle')
    setProgress(0)
    setCurrentWord(null)
    setCurrentChunk(0)
  }, [])

  const play = useCallback(
    (text: string, languageCode: string, voiceURI: string, rate: number) => {
      const synthesis = getSpeechSynthesis()
      if (!synthesis) {
        setError('Speech playback is not supported in this browser. Try a current version of Chrome, Edge, or Safari.')
        return
      }

      const chunks = splitTextIntoChunks(text)
      if (chunks.length === 0) {
        setError('Add some text before starting playback.')
        return
      }

      const voice = voices.find((candidate) => candidate.voiceURI === voiceURI)
      const session = sessionRef.current + 1
      sessionRef.current = session
      synthesis.cancel()
      setError(null)
      setTotalChunks(chunks.length)
      setCurrentChunk(1)
      setProgress(0)
      setCurrentWord(null)
      setStatus('speaking')

      const speakChunk = (index: number) => {
        if (sessionRef.current !== session) return

        if (index >= chunks.length) {
          setStatus('idle')
          setProgress(1)
          setCurrentChunk(chunks.length)
          return
        }

        const chunk = chunks[index]
        if (!chunk) return

        const utterance = new SpeechSynthesisUtterance(chunk.text)
        utterance.lang = languageCode
        utterance.voice = voice ?? null
        utterance.rate = rate
        utterance.onstart = () => {
          if (sessionRef.current === session) setStatus('speaking')
        }
        utterance.onboundary = (event) => {
          if (sessionRef.current !== session) return
          const currentPosition = chunk.startIndex + event.charIndex
          const remainingText = chunk.text.slice(event.charIndex)
          const boundaryLength = event.charLength > 0
            ? event.charLength
            : Math.max(remainingText.search(/\s|$/), 1)
          setProgress(Math.min(1, currentPosition / Math.max(text.length, 1)))
          setCurrentWord(remainingText.slice(0, boundaryLength).trim() || null)
        }
        utterance.onend = () => {
          if (sessionRef.current !== session) return
          setCurrentChunk(index + 2)
          speakChunk(index + 1)
        }
        utterance.onerror = (event) => {
          if (sessionRef.current !== session || event.error === 'canceled') return
          setStatus('idle')
          setCurrentWord(null)
          setError(
            event.error === 'not-allowed'
              ? 'Your browser blocked speech playback. Press Play again to allow it.'
              : 'Speech playback stopped unexpectedly. Try another voice or browser.',
          )
        }

        try {
          synthesis.speak(utterance)
        } catch {
          if (sessionRef.current === session) {
            setStatus('idle')
            setError('The selected voice could not start. Try another available voice.')
          }
        }
      }

      speakChunk(0)
    },
    [voices],
  )

  const pause = useCallback(() => {
    const synthesis = getSpeechSynthesis()
    if (!synthesis || status !== 'speaking') return
    synthesis.pause()
    setStatus('paused')
  }, [status])

  const resume = useCallback(() => {
    const synthesis = getSpeechSynthesis()
    if (!synthesis || status !== 'paused') return
    synthesis.resume()
    setStatus('speaking')
  }, [status])

  const clearError = useCallback(() => setError(null), [])

  useEffect(
    () => () => {
      sessionRef.current += 1
      getSpeechSynthesis()?.cancel()
    },
    [],
  )

  return {
    voices,
    status,
    progress,
    currentWord,
    currentChunk,
    totalChunks,
    error,
    play,
    pause,
    resume,
    stop,
    clearError,
  }
}

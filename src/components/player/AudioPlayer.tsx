import {
  CircleStop,
  Headphones,
  Pause,
  Play,
  Volume2,
} from 'lucide-react'
import type { SpeechStatus } from '../../types'

type AudioPlayerProps = {
  voices: SpeechSynthesisVoice[]
  languageCode: string
  selectedVoiceURI: string
  status: SpeechStatus
  progress: number
  currentWord: string | null
  currentChunk: number
  totalChunks: number
  onPlay: () => void
  onPause: () => void
  onResume: () => void
  onStop: () => void
  onVoiceChange: (voiceURI: string) => void
  onRateChange: (rate: number) => void
}

const WAVE_HEIGHTS = [12, 21, 15, 29, 18, 35, 22, 14, 28, 17, 33, 20, 13, 26, 17, 31, 19, 12, 24, 16, 29, 13, 22, 34, 17, 26, 14, 20, 30, 12, 23, 16, 28, 18, 33, 14, 24, 17, 29, 12, 21, 15, 31, 19, 26, 13, 22, 17, 30, 14, 25, 18, 33, 12, 21, 16, 28, 13, 23, 18, 31, 15, 26, 12, 20, 30, 17, 24, 14, 28, 19, 32, 13, 22, 16, 27, 12, 21, 18, 30]

export function AudioPlayer({
  voices,
  languageCode,
  selectedVoiceURI,
  status,
  progress,
  currentWord,
  currentChunk,
  totalChunks,
  onPlay,
  onPause,
  onResume,
  onStop,
  onVoiceChange,
  onRateChange,
}: AudioPlayerProps) {
  const languageVoices = voices.filter((voice) =>
    voice.lang.toLowerCase().startsWith(languageCode.slice(0, 2).toLowerCase()),
  )
  const active = status !== 'idle'

  return (
    <section className="panel player-panel" aria-label="Speech player">
      <div className="player-topline">
        <div className="player-title">
          <span className={`player-icon${active ? ' playing' : ''}`} aria-hidden="true">
            <Headphones size={17} />
          </span>
          <div>
            <strong>{status === 'paused' ? 'Paused' : active ? 'Reading aloud' : 'Ready when you are'}</strong>
            <span>
              {totalChunks > 1 && active
                ? `Section ${Math.min(currentChunk, totalChunks)} of ${totalChunks}`
                : 'Your audio session'}
            </span>
          </div>
        </div>
        <label className="voice-select">
          <Volume2 size={15} aria-hidden="true" />
          <span className="sr-only">Choose a voice</span>
          <select value={selectedVoiceURI} onChange={(event) => onVoiceChange(event.target.value)}>
            <option value="">System voice</option>
            {languageVoices.map((voice) => (
              <option value={voice.voiceURI} key={voice.voiceURI}>
                {voice.name}{voice.default ? ' · Default' : ''}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div
        className={`waveform${active ? ' waveform-active' : ''}`}
        role="img"
        aria-label={active ? 'Speech playback in progress' : 'Speech playback visualization'}
      >
        {WAVE_HEIGHTS.map((height, index) => (
          <span
            key={index}
            className="wave-bar"
            style={{
              height: `${height}px`,
              opacity: index / WAVE_HEIGHTS.length <= progress && active ? 1 : undefined,
            }}
          />
        ))}
      </div>

      <div
        className="playback-progress"
        role="progressbar"
        aria-label="Reading progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress * 100)}
      >
        <span style={{ width: `${Math.round(progress * 100)}%` }} />
      </div>
      <div className="current-word" aria-live="off">
        {currentWord && (
          <>
            <span>NOW READING</span>
            <mark>{currentWord}</mark>
          </>
        )}
      </div>
      <div className="player-controls">
        <div className="playback-buttons">
          <button
            className="play-button"
            type="button"
            onClick={status === 'speaking' ? onPause : status === 'paused' ? onResume : onPlay}
            aria-label={status === 'speaking' ? 'Pause reading' : status === 'paused' ? 'Resume reading' : 'Play text'}
          >
            {status === 'speaking' ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
          </button>
          <button
            className="stop-button"
            type="button"
            onClick={onStop}
            disabled={!active}
            aria-label="Stop reading"
          >
            <CircleStop size={19} />
          </button>
        </div>

        <label className="speed-control">
          <span>Speed</span>
          <select defaultValue="1" onChange={(event) => onRateChange(Number(event.target.value))}>
            <option value="0.7">0.7×</option>
            <option value="0.85">0.85×</option>
            <option value="1">1×</option>
            <option value="1.15">1.15×</option>
            <option value="1.3">1.3×</option>
          </select>
        </label>
      </div>
      {languageVoices.length === 0 && (
        <p className="voice-note">No {languageCode.slice(0, 2).toUpperCase()} system voice found. Your browser may use its default voice.</p>
      )}
    </section>
  )
}

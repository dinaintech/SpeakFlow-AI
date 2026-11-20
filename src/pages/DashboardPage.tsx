import { Bookmark, Headphones, Languages, Sparkles } from 'lucide-react'
import { AudioPlayer } from '../components/player/AudioPlayer'
import { Sidebar } from '../components/layout/Sidebar'
import { TextEditor } from '../components/reader/TextEditor'
import { TextLibrary } from '../components/library/TextLibrary'
import type {
  AppView,
  HistoryEntry,
  LanguageOption,
  SavedText,
  SpeechStatus,
} from '../types'

type DashboardPageProps = {
  activeView: AppView
  text: string
  language: LanguageOption
  selectedVoiceURI: string
  voices: SpeechSynthesisVoice[]
  status: SpeechStatus
  progress: number
  currentWord: string | null
  currentChunk: number
  totalChunks: number
  savedTexts: SavedText[]
  history: HistoryEntry[]
  error: string | null
  onChangeView: (view: AppView) => void
  onTextChange: (text: string) => void
  onLanguageChange: (language: LanguageOption) => void
  onVoiceChange: (voiceURI: string) => void
  onRateChange: (rate: number) => void
  onClean: () => void
  onUseSample: () => void
  onPlay: () => void
  onPause: () => void
  onResume: () => void
  onStop: () => void
  onSave: () => void
  onCopy: (text: string) => void
  onLoadText: (text: string) => void
  onDelete: (id: string) => void
  onDismissError: () => void
}

export function DashboardPage(props: DashboardPageProps) {
  const {
    activeView,
    text,
    language,
    selectedVoiceURI,
    voices,
    status,
    progress,
    currentWord,
    currentChunk,
    totalChunks,
    savedTexts,
    history,
    error,
    onChangeView,
    onTextChange,
    onLanguageChange,
    onVoiceChange,
    onClean,
    onUseSample,
    onPlay,
    onPause,
    onResume,
    onStop,
    onSave,
    onCopy,
    onLoadText,
    onDelete,
    onDismissError,
  } = props

  const currentSaved = savedTexts.some((item) => item.text === text.trim() && text.trim() !== '')
  const languageVoices = voices.filter((voice) =>
    voice.lang.toLowerCase().startsWith(language.code.slice(0, 2).toLowerCase()),
  )

  return (
    <div className="app-shell" id="reader">
      <Sidebar
        activeView={activeView}
        savedCount={savedTexts.length}
        historyCount={history.length}
        onChangeView={onChangeView}
      />

      <main className="main-content">
        <header className="topbar">
          <div className="mobile-brand">
            <span className="brand-mark" aria-hidden="true"><Sparkles size={18} /></span>
            <strong>SpeakFlow</strong>
          </div>
          <div className="breadcrumb">
            <span>Workspace</span><span className="breadcrumb-divider">/</span>
            <strong>{activeView === 'reader' ? 'Reader' : activeView === 'saved' ? 'Saved texts' : 'Listening history'}</strong>
          </div>
          <div className="topbar-status"><span className="online-dot" /> Favorites and history stay on this device</div>
        </header>

        <div className="page-content">
          {error && (
            <div className="error-banner" role="alert">
              <span>{error}</span>
              <button type="button" onClick={onDismissError} aria-label="Dismiss message">×</button>
            </div>
          )}

          {activeView === 'reader' ? (
            <>
              <section className="welcome-row">
                <div>
                  <div className="welcome-kicker"><span className="welcome-sparkle"><Sparkles size={14} /></span> A LITTLE SPACE TO LISTEN</div>
                  <h1>Read less. <span>Hear more.</span></h1>
                  <p>Turn the words in front of you into a moment for your ears.</p>
                </div>
                <div className="welcome-decoration" aria-hidden="true">
                  <span className="decoration-orbit orbit-one" />
                  <span className="decoration-orbit orbit-two" />
                  <span className="decoration-core"><Headphones size={27} /></span>
                  <span className="decoration-sparkle"><Sparkles size={14} /></span>
                </div>
              </section>

              <div className="stats-row" aria-label="Workspace overview">
                <div className="stat-card">
                  <span className="stat-icon violet"><Bookmark size={16} /></span>
                  <span className="stat-copy"><strong>{savedTexts.length}</strong><small>Saved reads</small></span>
                </div>
                <div className="stat-card">
                  <span className="stat-icon teal"><Headphones size={16} /></span>
                  <span className="stat-copy"><strong>{history.length}</strong><small>Sessions played</small></span>
                </div>
                <div className="stat-card">
                  <span className="stat-icon amber"><Languages size={16} /></span>
                  <span className="stat-copy"><strong>3</strong><small>Languages supported</small></span>
                </div>
              </div>

              <div className="reader-grid">
                <div className="reader-main-column">
                  <TextEditor
                    text={text}
                    language={language}
                    characterCount={text.length}
                    onTextChange={onTextChange}
                    onLanguageChange={onLanguageChange}
                    onClean={onClean}
                    onUseSample={onUseSample}
                  />
                  <div className="reader-actions-row">
                    <p className="privacy-note"><span className="privacy-dot" /> Your text stays on this device.</p>
                    <div className="text-actions">
                      <button
                        type="button"
                        className={`button ${currentSaved ? 'button-saved' : 'button-quiet'}`}
                        onClick={onSave}
                        disabled={!text.trim()}
                      >
                        <Bookmark size={15} fill={currentSaved ? 'currentColor' : 'none'} />
                        {currentSaved ? 'Saved to favorites' : 'Save text'}
                      </button>
                      <button
                        type="button"
                        className="button button-quiet"
                        onClick={() => onCopy(text)}
                        disabled={!text.trim()}
                      >
                        Copy text
                      </button>
                    </div>
                  </div>
                  <AudioPlayer
                    voices={voices}
                    languageCode={language.code}
                    selectedVoiceURI={selectedVoiceURI}
                    status={status}
                    progress={progress}
                    currentWord={currentWord}
                    currentChunk={currentChunk}
                    totalChunks={totalChunks}
                    onPlay={onPlay}
                    onPause={onPause}
                    onResume={onResume}
                    onStop={onStop}
                    onVoiceChange={onVoiceChange}
                    onRateChange={props.onRateChange}
                  />
                </div>

                <aside className="reader-aside">
                  <div className="aside-card voice-card">
                    <div className="aside-card-heading">
                      <span className="aside-card-icon"><Languages size={16} /></span>
                      <span>YOUR SETUP</span>
                    </div>
                    <div className="setup-row">
                      <span>Reading language</span>
                      <strong><span className="language-dot" />{language.label}</strong>
                    </div>
                    <div className="setup-row">
                      <span>Available voices</span>
                      <strong>{languageVoices.length || 'System'}</strong>
                    </div>
                    <div className="aside-divider" />
                    <p className="voice-caption">
                      {languageVoices.length > 0
                        ? `${languageVoices.length} ${languageVoices.length === 1 ? 'voice is' : 'voices are'} available for ${language.label}.`
                        : `Your device will use its default voice for ${language.label}.`}
                    </p>
                  </div>
                  <div className="aside-card tip-card">
                    <span className="tip-glow" aria-hidden="true"><Sparkles size={16} /></span>
                    <strong>A small reading tip</strong>
                    <p>Long articles are automatically divided into comfortable sections for smoother listening.</p>
                    <span className="tip-footer">MADE FOR YOUR PACE</span>
                  </div>
                  <div className="privacy-card">
                    <span className="privacy-shield" aria-hidden="true">✓</span>
                    <p><strong>Private by design</strong><br />Texts and history stay in your browser.</p>
                  </div>
                </aside>
              </div>
            </>
          ) : (
            <TextLibrary
              kind={activeView}
              savedTexts={savedTexts}
              history={history}
              onLoad={onLoadText}
              onDelete={onDelete}
              onCopy={onCopy}
            />
          )}
          <footer className="page-footer">
            <span>SpeakFlow AI</span><span>Listen at your own pace.</span>
          </footer>
        </div>
      </main>
    </div>
  )
}

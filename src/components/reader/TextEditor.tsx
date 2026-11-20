import { AlignLeft, Eraser, Sparkles } from 'lucide-react'
import type { LanguageOption } from '../../types'

type TextEditorProps = {
  text: string
  language: LanguageOption
  characterCount: number
  onTextChange: (text: string) => void
  onLanguageChange: (language: LanguageOption) => void
  onClean: () => void
  onUseSample: () => void
}

const LANGUAGES: LanguageOption[] = [
  { code: 'en-US', label: 'English', shortLabel: 'EN' },
  { code: 'ru-RU', label: 'Russian', shortLabel: 'RU' },
  { code: 'kk-KZ', label: 'Kazakh', shortLabel: 'KK' },
]

export function TextEditor({
  text,
  language,
  characterCount,
  onTextChange,
  onLanguageChange,
  onClean,
  onUseSample,
}: TextEditorProps) {
  return (
    <section className="panel editor-panel" aria-labelledby="editor-heading">
      <div className="panel-heading editor-heading">
        <div>
          <div className="eyebrow"><span className="eyebrow-dot" /> YOUR READING SPACE</div>
          <h2 id="editor-heading">What would you like to hear?</h2>
          <p className="panel-subtitle">Paste an article, notes, or anything you want to listen to.</p>
        </div>
        <label className="language-select">
          <span className="sr-only">Reading language</span>
          <select
            value={language.code}
            onChange={(event) => {
              const nextLanguage = LANGUAGES.find((item) => item.code === event.target.value)
              if (nextLanguage) onLanguageChange(nextLanguage)
            }}
          >
            {LANGUAGES.map((item) => (
              <option value={item.code} key={item.code}>{item.label}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="editor-wrap">
        <label className="sr-only" htmlFor="reading-text">Text to read aloud</label>
        <textarea
          id="reading-text"
          value={text}
          onChange={(event) => onTextChange(event.target.value)}
          placeholder="Paste or type your text here…"
          spellCheck
          aria-describedby="editor-hint"
        />
        {!text && (
          <div className="editor-empty-hint" id="editor-hint">
            <span className="empty-icon"><AlignLeft size={17} /></span>
            <span>Start with your own text, or try a sample to explore SpeakFlow.</span>
          </div>
        )}
        {text && <span className="sr-only" id="editor-hint">Your text is ready to be read aloud.</span>}
      </div>

      <div className="editor-footer">
        <span className="character-count">{characterCount.toLocaleString()} characters</span>
        <div className="editor-actions">
          <button className="button button-quiet" type="button" onClick={onUseSample}>
            <Sparkles size={15} aria-hidden="true" /> Try a sample
          </button>
          <button
            className="button button-quiet"
            type="button"
            onClick={onClean}
            disabled={!text.trim()}
          >
            <Eraser size={15} aria-hidden="true" /> Clean text
          </button>
        </div>
      </div>
    </section>
  )
}

import { BookOpen, Clock3, Headphones, Sparkles } from 'lucide-react'
import type { AppView } from '../../types'

type SidebarProps = {
  activeView: AppView
  savedCount: number
  historyCount: number
  onChangeView: (view: AppView) => void
}

const navigation: {
  view: AppView
  label: string
  icon: typeof Headphones
}[] = [
  { view: 'reader', label: 'Reader', icon: Headphones },
  { view: 'saved', label: 'Saved texts', icon: BookOpen },
  { view: 'history', label: 'Listening history', icon: Clock3 },
]

export function Sidebar({
  activeView,
  savedCount,
  historyCount,
  onChangeView,
}: SidebarProps) {
  const counts = { reader: null, saved: savedCount, history: historyCount }

  return (
    <aside className="sidebar">
      <a className="brand" href="#reader" onClick={() => onChangeView('reader')}>
        <span className="brand-mark" aria-hidden="true">
          <Sparkles size={20} strokeWidth={2.2} />
        </span>
        <span>
          <strong>SpeakFlow</strong>
          <small>AI READER</small>
        </span>
      </a>

      <div className="nav-section-label">WORKSPACE</div>
      <nav className="side-nav" aria-label="Main navigation">
        {navigation.map(({ view, label, icon: Icon }) => (
          <button
            className={`nav-item${activeView === view ? ' active' : ''}`}
            key={view}
            type="button"
            aria-label={label}
            aria-current={activeView === view ? 'page' : undefined}
            onClick={() => onChangeView(view)}
          >
            <Icon size={18} strokeWidth={1.8} aria-hidden="true" />
            <span>{label}</span>
            {counts[view] !== null && counts[view] > 0 && (
              <span className="nav-count" aria-hidden="true">{counts[view]}</span>
            )}
          </button>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <div className="sidebar-note">
          <span className="note-icon" aria-hidden="true">
            <Sparkles size={15} />
          </span>
          <p>Make room for ideas.<br />Listen at your own pace.</p>
        </div>
        <p className="sidebar-credit">A calmer way to take it all in.</p>
      </div>
    </aside>
  )
}

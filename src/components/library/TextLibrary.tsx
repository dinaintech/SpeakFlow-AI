import { ArrowUpRight, BookOpen, Clock3, Copy, Trash2 } from 'lucide-react'
import type { HistoryEntry, SavedText } from '../../types'
import { formatRelativeDate } from '../../utils/text'

type TextLibraryProps = {
  kind: 'saved' | 'history'
  savedTexts: SavedText[]
  history: HistoryEntry[]
  onLoad: (text: string) => void
  onDelete: (id: string) => void
  onCopy: (text: string) => void
}

export function TextLibrary({
  kind,
  savedTexts,
  history,
  onLoad,
  onDelete,
  onCopy,
}: TextLibraryProps) {
  const saved = kind === 'saved'
  const items = saved ? savedTexts : history

  return (
    <section className="library-view" aria-labelledby="library-title">
      <div className="library-heading">
        <div>
          <div className="eyebrow"><span className="eyebrow-dot" /> YOUR PERSONAL LIBRARY</div>
          <h2 id="library-title">{saved ? 'Saved texts' : 'Listening history'}</h2>
          <p>{saved ? 'Keep your favorite reads close at hand.' : 'Pick up where you left off.'}</p>
        </div>
        <span className="library-total">{items.length} {items.length === 1 ? 'item' : 'items'}</span>
      </div>

      {items.length === 0 ? (
        <div className="panel library-empty">
          <span className="empty-illustration" aria-hidden="true">
            {saved ? <BookOpen size={24} /> : <Clock3 size={24} />}
          </span>
          <h3>{saved ? 'Your saved reads will live here' : 'Your listening journey starts here'}</h3>
          <p>{saved ? 'Save a text from the reader and it will be ready whenever you are.' : 'Texts you play will appear here so you can return to them later.'}</p>
          <button className="button button-primary" type="button" onClick={() => onLoad('')}>
            Go to reader
          </button>
        </div>
      ) : (
        <div className="library-list">
          {items.map((item) => (
            <LibraryCard
              key={item.id}
              item={item}
              saved={saved}
              onLoad={onLoad}
              onDelete={onDelete}
              onCopy={onCopy}
            />
          ))}
        </div>
      )}
    </section>
  )
}

type LibraryItem = SavedText | HistoryEntry

function LibraryCard({
  item,
  saved,
  onLoad,
  onDelete,
  onCopy,
}: {
  item: LibraryItem
  saved: boolean
  onLoad: (text: string) => void
  onDelete: (id: string) => void
  onCopy: (text: string) => void
}) {
  const date = 'createdAt' in item ? item.createdAt : item.playedAt

  return (
    <article className="panel library-card">
      <div className="library-card-main">
        <span className="library-card-icon" aria-hidden="true">
          {saved ? <BookOpen size={17} /> : <Clock3 size={17} />}
        </span>
        <div className="library-card-copy">
          <h3>{item.title}</h3>
          <p>{item.text.slice(0, 190)}{item.text.length > 190 ? '…' : ''}</p>
          <span className="library-date">
            {formatRelativeDate(date)}
            <span aria-hidden="true"> · </span>
            {item.text.length.toLocaleString()} characters
          </span>
        </div>
      </div>
      <div className="library-card-actions">
        <button
          className="icon-button"
          type="button"
          onClick={() => onLoad(item.text)}
          aria-label={`Open ${item.title} in reader`}
        >
          <ArrowUpRight size={16} />
        </button>
        <button
          className="icon-button"
          type="button"
          onClick={() => onCopy(item.text)}
          aria-label={`Copy ${item.title}`}
        >
          <Copy size={16} />
        </button>
        {saved && (
          <button
            className="icon-button danger-hover"
            type="button"
            onClick={() => onDelete(item.id)}
            aria-label={`Delete ${item.title}`}
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>
    </article>
  )
}

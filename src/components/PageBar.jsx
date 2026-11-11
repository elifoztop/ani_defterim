import Icon from './Icon.jsx'
import { MESSAGES } from '../lib/messages.js'
import '../styles/PageBar.css'

export default function PageBar({ spreadIndex, pageCount, spreadTotal, canAdd, canDelete, onGo, onAdd, onDelete }) {
  const first = spreadIndex * 2 + 1
  const last = Math.min(first + 1, pageCount)
  const range = first === last ? `${first}` : `${first}–${last}`

  return (
    <nav className="pagebar glass" aria-label="Sayfa gezintisi">
      <button type="button" className="btn" disabled={spreadIndex === 0} onClick={() => onGo(spreadIndex - 1)}>
        <Icon name="chevronLeft" />
        Önceki
      </button>
      <span className="pagebar__label">
        Sayfa {range} / {pageCount}
      </span>
      <button
        type="button"
        className="btn"
        disabled={spreadIndex >= spreadTotal - 1}
        onClick={() => onGo(spreadIndex + 1)}
      >
        Sonraki
        <Icon name="chevronRight" />
      </button>
      <span className="pagebar__divider" aria-hidden="true" />
      <span className="pagebar__hint" title={canAdd ? undefined : MESSAGES.maxPages}>
        <button type="button" className="btn" disabled={!canAdd} onClick={onAdd}>
          <Icon name="plus" />
          Sayfa ekle
        </button>
      </span>
      <span className="pagebar__hint" title={canDelete ? undefined : MESSAGES.lastPage}>
        <button type="button" className="btn btn--danger" disabled={!canDelete} onClick={onDelete}>
          <Icon name="trash" />
          Sayfayı sil
        </button>
      </span>
    </nav>
  )
}

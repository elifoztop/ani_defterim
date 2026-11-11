import Icon from './Icon.jsx'
import '../styles/PageBar.css'

export default function PageBar({ spreadIndex, pageCount }) {
  const first = spreadIndex * 2 + 1
  const last = Math.min(first + 1, pageCount)
  const range = first === last ? `${first}` : `${first}–${last}`

  return (
    <nav className="pagebar glass" aria-label="Sayfa gezintisi">
      <button type="button" className="btn" disabled>
        <Icon name="chevronLeft" />
        Önceki
      </button>
      <span className="pagebar__label">
        Sayfa {range} / {pageCount}
      </span>
      <button type="button" className="btn" disabled>
        Sonraki
        <Icon name="chevronRight" />
      </button>
      <span className="pagebar__divider" aria-hidden="true" />
      <button type="button" className="btn" disabled>
        <Icon name="plus" />
        Sayfa ekle
      </button>
      <button type="button" className="btn btn--danger" disabled>
        <Icon name="trash" />
        Sayfayı sil
      </button>
    </nav>
  )
}

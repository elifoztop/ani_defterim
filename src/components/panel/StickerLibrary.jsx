import { LIBRARY } from '../../data/stickers.js'
import '../../styles/Properties.css'

// Aşama 3: yer tutucu kartlar. Çizimler Aşama 4'te gelir.
export default function StickerLibrary({ kind, onAdd }) {
  const entries = LIBRARY.filter((entry) => entry.kind === kind)
  return (
    <div className="library">
      {entries.map((entry) => (
        <button
          key={entry.id}
          type="button"
          className={`library__item library__item--${kind}`}
          onClick={() => onAdd(entry)}
        >
          <span className="library__thumb" aria-hidden="true" />
          {entry.label}
        </button>
      ))}
    </div>
  )
}

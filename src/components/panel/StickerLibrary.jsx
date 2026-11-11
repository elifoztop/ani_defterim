import { LIBRARY } from '../../data/stickers.js'
import '../../styles/Properties.css'

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
          <img className={`library__thumb${kind === 'sticker' ? ' art--cut' : ''}`} src={entry.src} alt="" />
          {entry.label}
        </button>
      ))}
    </div>
  )
}

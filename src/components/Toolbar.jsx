import Icon from './Icon.jsx'
import '../styles/Toolbar.css'

export default function Toolbar({ hasSelection, onTab, onAddText, onDeleteSelected }) {
  return (
    <div className="toolbar glass" role="toolbar" aria-label="Araçlar">
      <button type="button" className="btn" disabled title="Fotoğraf ekleme Aşama 4'te gelecek.">
        <Icon name="photo" />
        Fotoğraf ekle
      </button>
      <button type="button" className="btn" onClick={() => onTab('stickers')}>
        <Icon name="sticker" />
        Çıkartma
      </button>
      <button type="button" className="btn" onClick={() => onTab('decorations')}>
        <Icon name="sparkle" />
        Süs
      </button>
      <button type="button" className="btn" onClick={onAddText}>
        <Icon name="text" />
        Yazı ekle
      </button>
      <span className="toolbar__divider" aria-hidden="true" />
      <button type="button" className="btn btn--danger" disabled={!hasSelection} onClick={onDeleteSelected}>
        <Icon name="trash" />
        Seçileni sil
      </button>
    </div>
  )
}

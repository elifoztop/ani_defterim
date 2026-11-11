import Icon from './Icon.jsx'
import '../styles/Toolbar.css'

export default function Toolbar() {
  return (
    <div className="toolbar glass" role="toolbar" aria-label="Araçlar">
      <button type="button" className="btn" disabled>
        <Icon name="photo" />
        Fotoğraf ekle
      </button>
      <button type="button" className="btn" disabled>
        <Icon name="sticker" />
        Çıkartma
      </button>
      <button type="button" className="btn" disabled>
        <Icon name="sparkle" />
        Süs
      </button>
      <button type="button" className="btn" disabled>
        <Icon name="text" />
        Yazı ekle
      </button>
      <span className="toolbar__divider" aria-hidden="true" />
      <button type="button" className="btn btn--danger" disabled>
        <Icon name="trash" />
        Seçileni sil
      </button>
    </div>
  )
}

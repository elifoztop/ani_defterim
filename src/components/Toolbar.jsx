import { useRef } from 'react'
import Icon from './Icon.jsx'
import { PHOTO_ACCEPT } from '../lib/photoRules.js'
import { MESSAGES } from '../lib/messages.js'
import '../styles/Toolbar.css'

function PhotoButton({ canAdd, loading, onFile }) {
  const inputRef = useRef(null)
  const onChange = (event) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (file) onFile(file)
  }
  return (
    <span title={canAdd ? undefined : MESSAGES.photoLimit}>
      <button type="button" className="btn" disabled={!canAdd || loading} aria-busy={loading} onClick={() => inputRef.current?.click()}>
        {loading ? <span className="spinner" aria-hidden="true" /> : <Icon name="photo" />}
        {loading ? 'Yükleniyor…' : 'Fotoğraf ekle'}
      </button>
      <input ref={inputRef} type="file" accept={PHOTO_ACCEPT} hidden onChange={onChange} />
    </span>
  )
}

export default function Toolbar({ hasSelection, photo, onTab, onAddText, onDeleteSelected }) {
  return (
    <div className="toolbar glass" role="toolbar" aria-label="Araçlar">
      <PhotoButton canAdd={photo.canAdd} loading={photo.loading} onFile={photo.onFile} />
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

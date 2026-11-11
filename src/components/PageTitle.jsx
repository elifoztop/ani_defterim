import { useRef, useState } from 'react'
import { TITLE_MAX } from '../state/constants.js'

// Başlığa tıklayınca yerinde düzenlenir. Enter ya da dışarı tıklama kaydeder, Esc vazgeçer.
// title kayıttaki başlıktır (boş olabilir), shown ekranda görünen başlıktır.
export default function PageTitle({ title, shown, onRename }) {
  const [draft, setDraft] = useState(null)
  const doneRef = useRef(false)

  const start = () => {
    doneRef.current = false
    setDraft(title)
  }
  const finish = (save) => {
    if (doneRef.current) return
    doneRef.current = true
    if (save) onRename(draft)
    setDraft(null)
  }
  const onKeyDown = (event) => {
    if (event.key === 'Enter') finish(true)
    if (event.key === 'Escape') finish(false)
  }

  if (draft === null) {
    return (
      <h2 className="page-title">
        <button type="button" className="page-title__button" title="Başlığı düzenle" onClick={start}>
          {shown}
        </button>
      </h2>
    )
  }

  return (
    <h2 className="page-title">
      <input
        className="page-title__input"
        value={draft}
        maxLength={TITLE_MAX}
        placeholder={shown}
        aria-label="Sayfa başlığı"
        autoFocus
        onFocus={(event) => event.target.select()}
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={onKeyDown}
        onBlur={() => finish(true)}
      />
    </h2>
  )
}

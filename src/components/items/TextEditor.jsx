import { useEffect, useEffectEvent, useState } from 'react'

// Yazı düzenleme alanı. Yazılan metin yerel durumdadır. Düzenleme bitince (bileşen kalkınca)
// içerik reducer'a tek eylem olarak gider (SPEC 7.2). Esc düzenlemeden çıkar.
export default function TextEditor({ initial, style, onCommit, onExit }) {
  const [draft, setDraft] = useState(initial)
  const commit = useEffectEvent(() => onCommit(draft))

  useEffect(() => () => commit(), [])

  const onKeyDown = (event) => {
    if (event.key !== 'Escape') return
    event.preventDefault()
    onExit()
  }

  return (
    <div className="text-item text-editor" style={style}>
      <div className="text-editor__mirror" aria-hidden="true">{`${draft} `}</div>
      <textarea
        className="text-editor__input"
        value={draft}
        aria-label="Yazı"
        autoFocus
        onFocus={(event) => event.target.select()}
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={onKeyDown}
      />
    </div>
  )
}

import { useEffect, useEffectEvent, useState } from 'react'
import { TITLE_MAX } from '../../state/constants.js'

// Polaroid notu. Yazarken yerel kalır. Alan bırakılınca, Enter ile ya da panel
// kapanırken (başka nesne seçilince) tek eylem gider. Kullanıcı değiştirmediyse eylem gitmez.
export default function CaptionField({ caption, onCommit }) {
  const [draft, setDraft] = useState(caption)
  const save = () => {
    if (draft !== caption) onCommit(draft)
  }
  const saveOnUnmount = useEffectEvent(save)

  useEffect(() => () => saveOnUnmount(), [])

  return (
    <label className="props__field">
      <span className="props__label">Not</span>
      <input
        className="props__text font-hand"
        type="text"
        value={draft}
        maxLength={TITLE_MAX}
        placeholder="Fotoğrafın altına bir not yaz"
        onChange={(event) => setDraft(event.target.value)}
        onBlur={save}
        onKeyDown={(event) => event.key === 'Enter' && save()}
      />
    </label>
  )
}

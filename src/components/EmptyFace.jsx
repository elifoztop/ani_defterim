import Icon from './Icon.jsx'
import { MESSAGES } from '../lib/messages.js'

export default function EmptyFace({ canAdd, onAdd }) {
  return (
    <section className="page page--right page--empty" aria-label="Boş sayfa">
      <span title={canAdd ? undefined : MESSAGES.maxPages}>
        <button type="button" className="btn page__add" disabled={!canAdd} onClick={onAdd}>
          <Icon name="plus" />
          Sayfa ekle
        </button>
      </span>
    </section>
  )
}

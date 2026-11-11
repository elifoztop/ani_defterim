import Icon from './Icon.jsx'

export default function EmptyFace() {
  return (
    <section className="page page--right page--empty" aria-label="Boş sayfa">
      <button type="button" className="btn page__add" disabled>
        <Icon name="plus" />
        Sayfa ekle
      </button>
    </section>
  )
}

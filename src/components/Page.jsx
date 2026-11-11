import PageTitle from './PageTitle.jsx'
import { displayTitle } from '../state/model.js'

export default function Page({ page, index, side, activePageId, onActivate, onRename }) {
  const active = page.id === activePageId
  const shown = displayTitle(page, index)
  const className = `page page--${side}${active ? ' page--active' : ''}`
  return (
    <section className={className} aria-label={shown} onPointerDown={() => onActivate(page.id)}>
      <PageTitle title={page.title} shown={shown} onRename={(title) => onRename(page.id, title)} />
      {page.items.length === 0 && (
        <p className="page__hint font-hand">Panelden bir fotoğraf, çıkartma ya da not ekle →</p>
      )}
    </section>
  )
}

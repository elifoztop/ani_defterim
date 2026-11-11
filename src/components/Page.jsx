import PageTitle from './PageTitle.jsx'
import ItemFrame from './items/ItemFrame.jsx'
import { displayTitle } from '../state/model.js'

export default function Page({ page, index, side, opposite, activePageId, onActivate, onRename, editor }) {
  const active = page.id === activePageId
  const shown = displayTitle(page, index)
  const className = `page page--${side}${active ? ' page--active' : ''}`

  // Nesneler pointerdown olayını kendileri durdurur. Buraya gelen tıklama boş alana yapılmıştır.
  const onPointerDown = () => {
    onActivate(page.id)
    editor.deselect()
  }

  return (
    <section className={className} aria-label={shown} onPointerDown={onPointerDown}>
      <PageTitle title={page.title} shown={shown} onRename={(title) => onRename(page.id, title)} />
      {page.items.length === 0 && (
        <p className="page__hint font-hand">Panelden bir fotoğraf, çıkartma ya da not ekle →</p>
      )}
      {page.items.map((item) => (
        <ItemFrame key={item.id} item={item} pageId={page.id} side={side} opposite={opposite} editor={editor} />
      ))}
    </section>
  )
}

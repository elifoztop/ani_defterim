import PageTitle from './PageTitle.jsx'

export default function Page({ page, side, active }) {
  const className = `page page--${side}${active ? ' page--active' : ''}`
  return (
    <section className={className} aria-label={page.title}>
      <PageTitle title={page.title} />
      {page.items.length === 0 && (
        <p className="page__hint font-hand">Panelden bir fotoğraf, çıkartma ya da not ekle →</p>
      )}
    </section>
  )
}

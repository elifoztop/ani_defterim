import Page from './Page.jsx'
import EmptyFace from './EmptyFace.jsx'
import PageLeaf from './PageLeaf.jsx'
import { canAddPhoto } from '../lib/photoRules.js'
import '../styles/Notebook.css'

export default function Notebook({ leftPage, leftIndex, rightPage, activePageId, canAdd, onAddPage, onActivate, onRename, editor }) {
  const pageProps = { activePageId, onActivate, onRename, editor }
  // Nesne açık defterdeki karşı sayfaya geçebilir (karar 100). Boş yüze geçiş yok.
  const oppositeOf = (page) => page && { pageId: page.id, acceptsPhoto: canAddPhoto(page) }
  return (
    <div className="notebook-stage">
      <div className="notebook">
        <Page key={leftPage.id} page={leftPage} index={leftIndex} side="left" opposite={oppositeOf(rightPage)} {...pageProps} />
        {rightPage ? (
          <Page key={rightPage.id} page={rightPage} index={leftIndex + 1} side="right" opposite={oppositeOf(leftPage)} {...pageProps} />
        ) : (
          <EmptyFace key={`empty-${leftPage.id}`} canAdd={canAdd} onAdd={onAddPage} />
        )}
        <PageLeaf spreadIndex={leftIndex / 2} />
        <span className="notebook__ribbon" aria-hidden="true" />
        <span className="notebook__footer notebook__footer--left font-hand" aria-hidden="true">
          Anı Defterim
        </span>
        <span className="notebook__footer notebook__footer--right font-hand" aria-hidden="true">
          Burası benim krallığım
        </span>
      </div>
    </div>
  )
}

import Page from './Page.jsx'
import EmptyFace from './EmptyFace.jsx'
import '../styles/Notebook.css'

export default function Notebook({ leftPage, leftIndex, rightPage, activePageId, canAdd, onAddPage, onActivate, onRename }) {
  const pageProps = { activePageId, onActivate, onRename }
  return (
    <div className="notebook-stage">
      <div className="notebook">
        <Page key={leftPage.id} page={leftPage} index={leftIndex} side="left" {...pageProps} />
        {rightPage ? (
          <Page key={rightPage.id} page={rightPage} index={leftIndex + 1} side="right" {...pageProps} />
        ) : (
          <EmptyFace key={`empty-${leftPage.id}`} canAdd={canAdd} onAdd={onAddPage} />
        )}
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

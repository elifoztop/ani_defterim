import Page from './Page.jsx'
import EmptyFace from './EmptyFace.jsx'
import '../styles/Notebook.css'

export default function Notebook({ leftPage, rightPage, activePageId }) {
  return (
    <div className="notebook-stage">
      <div className="notebook">
        <Page page={leftPage} side="left" active={leftPage.id === activePageId} />
        {rightPage ? (
          <Page page={rightPage} side="right" active={rightPage.id === activePageId} />
        ) : (
          <EmptyFace />
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

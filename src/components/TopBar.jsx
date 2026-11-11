import Icon from './Icon.jsx'
import SaveStatus from './SaveStatus.jsx'
import '../styles/TopBar.css'

export default function TopBar({ status, canUndo, canRedo, onUndo, onRedo }) {
  return (
    <header className="topbar">
      <div className="topbar__brand">
        <span className="topbar__logo">
          <Icon name="crown" />
        </span>
        <div>
          <h1 className="topbar__name">Anı Defterim</h1>
          <p className="topbar__slogan font-hand">Burası benim krallığım</p>
        </div>
      </div>

      <SaveStatus status={status} />

      <div className="topbar__actions">
        <button type="button" className="btn btn--icon" aria-label="Geri al" title="Geri al" disabled={!canUndo} onClick={onUndo}>
          <Icon name="undo" />
        </button>
        <button type="button" className="btn btn--icon" aria-label="Yinele" title="Yinele" disabled={!canRedo} onClick={onRedo}>
          <Icon name="redo" />
        </button>
      </div>
    </header>
  )
}

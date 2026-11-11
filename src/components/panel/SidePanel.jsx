import Icon from '../Icon.jsx'
import StorageMeter from './StorageMeter.jsx'
import '../../styles/SidePanel.css'

export default function SidePanel() {
  return (
    <aside className="side-panel" aria-label="Panel">
      <div className="side-panel__tabs" role="tablist">
        <button type="button" role="tab" className="side-panel__tab" aria-selected="true">
          <Icon name="sticker" />
          Çıkartmalar
        </button>
        <button type="button" role="tab" className="side-panel__tab" aria-selected="false" disabled>
          <Icon name="sparkle" />
          Süsler
        </button>
        <button type="button" role="tab" className="side-panel__tab" aria-selected="false" disabled>
          <Icon name="sliders" />
          Özellikler
        </button>
      </div>

      <div className="side-panel__body" role="tabpanel">
        <p className="side-panel__empty">Çıkartmalar burada görünecek.</p>
      </div>

      <div className="side-panel__footer">
        <StorageMeter percent={0} />
      </div>
    </aside>
  )
}

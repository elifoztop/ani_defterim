import Icon from '../Icon.jsx'
import StorageMeter from './StorageMeter.jsx'
import '../../styles/SidePanel.css'

const TABS = [
  { id: 'stickers', label: 'Çıkartmalar', icon: 'sticker', empty: 'Çıkartmalar burada görünecek.' },
  { id: 'decorations', label: 'Süsler', icon: 'sparkle', empty: 'Süsler burada görünecek.' },
  { id: 'properties', label: 'Özellikler', icon: 'sliders', empty: 'Seçili nesnenin ayarları burada görünecek.' },
]

export default function SidePanel({ panelTab, hasSelection, onTab, usageRatio }) {
  const current = TABS.find((tab) => tab.id === panelTab) ?? TABS[0]
  return (
    <aside className="side-panel" aria-label="Panel">
      <div className="side-panel__tabs" role="tablist">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            className="side-panel__tab"
            aria-selected={tab.id === current.id}
            disabled={tab.id === 'properties' && !hasSelection}
            onClick={() => onTab(tab.id)}
          >
            <Icon name={tab.icon} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="side-panel__body" role="tabpanel" aria-label={current.label}>
        <p className="side-panel__empty">{current.empty}</p>
      </div>

      <div className="side-panel__footer">
        <StorageMeter ratio={usageRatio} />
      </div>
    </aside>
  )
}

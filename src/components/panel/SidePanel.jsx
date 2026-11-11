import Icon from '../Icon.jsx'
import StorageMeter from './StorageMeter.jsx'
import StickerLibrary from './StickerLibrary.jsx'
import PropertiesPanel from './PropertiesPanel.jsx'
import '../../styles/SidePanel.css'

const TABS = [
  { id: 'stickers', label: 'Çıkartmalar', icon: 'sticker' },
  { id: 'decorations', label: 'Süsler', icon: 'sparkle' },
  { id: 'properties', label: 'Özellikler', icon: 'sliders' },
]

function PanelBody({ tab, selected, editor, onAddLibraryItem }) {
  if (tab === 'stickers') return <StickerLibrary kind="sticker" onAdd={onAddLibraryItem} />
  if (tab === 'decorations') return <StickerLibrary kind="decoration" onAdd={onAddLibraryItem} />
  if (!selected) return <p className="side-panel__empty">Ayarları görmek için bir nesne seç.</p>
  return <PropertiesPanel item={selected.item} pageId={selected.pageId} editor={editor} />
}

export default function SidePanel({ panelTab, selected, editor, onTab, onAddLibraryItem, usageRatio }) {
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
            disabled={tab.id === 'properties' && !selected}
            onClick={() => onTab(tab.id)}
          >
            <Icon name={tab.icon} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="side-panel__body" role="tabpanel" aria-label={current.label}>
        <PanelBody tab={current.id} selected={selected} editor={editor} onAddLibraryItem={onAddLibraryItem} />
      </div>

      <div className="side-panel__footer">
        <StorageMeter ratio={usageRatio} />
      </div>
    </aside>
  )
}

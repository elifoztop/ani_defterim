import Icon from '../Icon.jsx'
import RotationSlider from './RotationSlider.jsx'
import TextProperties from './TextProperties.jsx'
import { findLibraryEntry } from '../../data/stickers.js'
import '../../styles/Properties.css'

const TYPE_LABELS = { photo: 'Fotoğraf', sticker: 'Çıkartma', decoration: 'Süs', text: 'Yazı' }

function typeLabel(item) {
  const entry = findLibraryEntry(item.props.stickerId ?? item.props.decorationId)
  return entry ? `${TYPE_LABELS[item.type]} · ${entry.label}` : TYPE_LABELS[item.type]
}

export default function PropertiesPanel({ item, pageId, editor }) {
  const run = (method) => () => editor[method](pageId, item.id)

  return (
    <div className="props">
      <p className="props__type">{typeLabel(item)}</p>

      <RotationSlider
        key={item.id}
        rotation={item.rotation}
        onPreview={(value) => editor.previewRotation(item.id, value)}
        onCommit={(rotation) => editor.transform(pageId, item.id, { ...item, rotation })}
      />

      {item.type === 'text' && (
        <TextProperties props={item.props} onChange={(props) => editor.updateProps(pageId, item.id, props)} />
      )}

      <div className="props__row">
        <button type="button" className="btn" onClick={run('bringToFront')}>
          <Icon name="bringFront" />
          Öne getir
        </button>
        <button type="button" className="btn" onClick={run('sendToBack')}>
          <Icon name="sendBack" />
          Arkaya gönder
        </button>
      </div>
      <button type="button" className="btn btn--danger props__delete" onClick={run('deleteItem')}>
        <Icon name="trash" />
        Sil
      </button>
    </div>
  )
}

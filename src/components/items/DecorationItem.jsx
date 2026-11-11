import { findLibraryEntry } from '../../data/stickers.js'

// Aşama 3: yer tutucu şekil. Çizim Aşama 4'te gelir.
export default function DecorationItem({ item }) {
  const entry = findLibraryEntry(item.props.decorationId)
  return (
    <div className="placeholder placeholder--decoration">
      <span>{entry?.label ?? 'Süs'}</span>
    </div>
  )
}

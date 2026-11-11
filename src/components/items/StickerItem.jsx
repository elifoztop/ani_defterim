import { findLibraryEntry } from '../../data/stickers.js'

// Aşama 3: yer tutucu şekil. Çizim Aşama 4'te gelir.
export default function StickerItem({ item }) {
  const entry = findLibraryEntry(item.props.stickerId)
  return (
    <div className="placeholder placeholder--sticker">
      <span>{entry?.label ?? 'Çıkartma'}</span>
    </div>
  )
}

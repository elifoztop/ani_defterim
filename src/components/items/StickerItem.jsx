import { findLibraryEntry } from '../../data/stickers.js'

// Çıkartmanın çevresinde krem kesim kenarı vardır (SPEC 8.1, CSS: .art--cut).
export default function StickerItem({ item }) {
  const entry = findLibraryEntry(item.props.stickerId)
  if (!entry) return <div className="art art--missing">Çıkartma bulunamadı</div>
  return <img className="art art--cut" src={entry.src} alt={entry.label} draggable={false} />
}

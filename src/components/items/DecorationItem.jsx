import { findLibraryEntry } from '../../data/stickers.js'

// Süslerde kesim kenarı yoktur (SPEC 8.2).
export default function DecorationItem({ item }) {
  const entry = findLibraryEntry(item.props.decorationId)
  if (!entry) return <div className="art art--missing">Süs bulunamadı</div>
  return <img className="art" src={entry.src} alt={entry.label} draggable={false} />
}

// Fotoğraf her zaman polaroid çerçevede görünür; alt kısım daha geniştir (SPEC 5).
export default function PhotoItem({ item }) {
  const { src, caption } = item.props
  return (
    <figure className="polaroid">
      <img className="polaroid__image" src={src} alt={caption || 'Fotoğraf'} draggable={false} />
      <figcaption className="polaroid__caption font-hand">{caption}</figcaption>
    </figure>
  )
}

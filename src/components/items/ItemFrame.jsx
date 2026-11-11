import { useItemTransform } from '../../hooks/useItemTransform.js'
import TextItem from './TextItem.jsx'
import StickerItem from './StickerItem.jsx'
import DecorationItem from './DecorationItem.jsx'
import '../../styles/Items.css'

const unit = (value) => `calc(var(--u) * ${value})`
const TYPE_LABELS = { photo: 'Fotoğraf', sticker: 'Çıkartma', decoration: 'Süs', text: 'Yazı' }

function ItemContent({ item, pageId, editing, editor }) {
  if (item.type === 'text') {
    return (
      <TextItem
        item={item}
        editing={editing}
        onMeasure={(h) => editor.measure(pageId, item.id, h)}
        onCommit={(content) => editor.commitText(pageId, item.id, content)}
        onExit={editor.endEdit}
      />
    )
  }
  if (item.type === 'sticker') return <StickerItem item={item} />
  if (item.type === 'decoration') return <DecorationItem item={item} />
  return null
}

export default function ItemFrame({ item, pageId, editor }) {
  const selected = editor.selectedItemId === item.id
  const editing = editor.editingItemId === item.id
  const isText = item.type === 'text'
  const { draft, handlers } = useItemTransform(item, {
    disabled: editing,
    onStart: () => !editing && editor.select(pageId, item.id),
    onCommit: (next) => editor.transform(pageId, item.id, next),
  })

  const shown = draft ?? item
  const rotation = editor.preview?.itemId === item.id ? editor.preview.rotation : shown.rotation
  const style = {
    left: unit(shown.x - shown.w / 2),
    top: unit(shown.y - shown.h / 2),
    width: unit(shown.w),
    height: isText ? 'auto' : unit(shown.h),
    transform: `rotate(${rotation}deg)`,
  }
  const className = `item-frame item-frame--${item.type}${selected ? ' item-frame--selected' : ''}${
    editing ? ' item-frame--editing' : ''
  }`

  return (
    <div
      className={className}
      style={style}
      aria-label={TYPE_LABELS[item.type]}
      onDoubleClick={isText ? () => editor.startEdit(item.id) : undefined}
      {...handlers}
    >
      <ItemContent item={item} pageId={pageId} editing={editing} editor={editor} />
      {selected && !editing && (
        <>
          <span className="item-frame__handle item-frame__handle--rotate" data-handle="rotate" title="Döndür (Shift: 15°)" />
          <span className="item-frame__handle item-frame__handle--resize" data-handle="resize" title="Boyutlandır" />
        </>
      )}
    </div>
  )
}

import { useItemTransform } from '../../hooks/useItemTransform.js'
import TextItem from './TextItem.jsx'
import StickerItem from './StickerItem.jsx'
import DecorationItem from './DecorationItem.jsx'
import PhotoItem from './PhotoItem.jsx'
import { ITEM_TYPE_LABELS, MESSAGES } from '../../lib/messages.js'
import { dragBoundsX, dropTarget } from '../../lib/geometry.js'
import '../../styles/Items.css'

const unit = (value) => `calc(var(--u) * ${value})`

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
  if (item.type === 'photo') return <PhotoItem item={item} />
  return null
}

// opposite: açık defterdeki karşı sayfa { pageId, acceptsPhoto } ya da null.
export default function ItemFrame({ item, pageId, side, opposite, editor }) {
  const selected = editor.selectedItemId === item.id
  const editing = editor.editingItemId === item.id
  const isText = item.type === 'text'

  // Bırakınca nesne merkezinin düştüğü sayfaya ait olur (karar 100).
  const commit = (next) => {
    const drop = dropTarget(next.x, side)
    if (!drop.crossed || !opposite) {
      editor.transform(pageId, item.id, next)
      return
    }
    if (item.type === 'photo' && !opposite.acceptsPhoto) editor.notify(MESSAGES.photoLimit)
    editor.transform(pageId, item.id, { ...next, x: drop.x }, opposite.pageId)
  }

  const { draft, handlers } = useItemTransform(item, {
    disabled: editing,
    bounds: dragBoundsX(side, Boolean(opposite)),
    onStart: () => !editing && editor.select(pageId, item.id),
    onCommit: commit,
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
  const className = [
    'item-frame',
    `item-frame--${item.type}`,
    selected && 'item-frame--selected',
    editing && 'item-frame--editing',
    draft && 'item-frame--dragging',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div
      className={className}
      style={style}
      aria-label={ITEM_TYPE_LABELS[item.type]}
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

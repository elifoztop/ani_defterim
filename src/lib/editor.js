// Nesne bileşenlerinin kullandığı eylem fonksiyonları. Bileşenler veriyi değiştirmez,
// yalnızca bu fonksiyonlarla reducer'a eylem gönderir.
export function createEditor(send, ui, preview, setPreview) {
  const target = (pageId, itemId) => ({ pageId, itemId })
  return {
    selectedItemId: ui.selectedItemId,
    editingItemId: ui.editingItemId,
    preview,
    select: (pageId, itemId) => send('ui/select', { pageId, itemId }),
    deselect: () => send('ui/deselect'),
    startEdit: (itemId) => send('ui/startEdit', { itemId }),
    endEdit: () => send('ui/endEdit'),
    transform: (pageId, itemId, { x, y, w, h, rotation }) =>
      send('item/transform', { ...target(pageId, itemId), x, y, w, h, rotation }),
    measure: (pageId, itemId, h) => send('item/measure', { ...target(pageId, itemId), h }),
    commitText: (pageId, itemId, content) =>
      send('item/updateProps', { ...target(pageId, itemId), props: { content } }),
    updateProps: (pageId, itemId, props) => send('item/updateProps', { ...target(pageId, itemId), props }),
    bringToFront: (pageId, itemId) => send('item/bringToFront', target(pageId, itemId)),
    sendToBack: (pageId, itemId) => send('item/sendToBack', target(pageId, itemId)),
    deleteItem: (pageId, itemId) => send('item/delete', target(pageId, itemId)),
    previewRotation: (itemId, rotation) => setPreview(rotation === null ? null : { itemId, rotation }),
  }
}

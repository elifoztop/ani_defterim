import { NEW_TEXT_PROPS, createItem, createPage } from './model.js'
import { polaroidSize } from '../lib/photoRules.js'

// Eylem oluşturucular. id ve rastgele açı burada üretilir, reducer saf kalır (karar 40).

export const addPageAction = () => ({ type: 'page/add', payload: { page: createPage() } })

export const addTextAction = (pageId) => ({
  type: 'item/add',
  payload: { pageId, item: createItem('text', { ...NEW_TEXT_PROPS }) },
})

// Çıkartma ve süs −4° ile +4° arası rastgele bir açıyla eklenir (SPEC 6.5).
export function addLibraryItemAction(pageId, entry, random = Math.random) {
  const rotation = Math.round((random() * 8 - 4) * 10) / 10
  const props = entry.kind === 'sticker' ? { stickerId: entry.id } : { decorationId: entry.id }
  const item = createItem(entry.kind, props, { size: entry.size, rotation })
  return { type: 'item/add', payload: { pageId, item } }
}

// photo: küçültülmüş fotoğraf { src, width, height }.
export function addPhotoAction(pageId, photo) {
  const item = createItem('photo', { src: photo.src, caption: '' }, { size: polaroidSize(photo.width, photo.height) })
  return { type: 'item/add', payload: { pageId, item } }
}

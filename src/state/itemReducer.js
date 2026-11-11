import { MAX_PHOTOS_PER_PAGE, PAGE_W } from './constants.js'
import { clampItemToPage } from '../lib/geometry.js'

// Nesne eylemleri. Değişiklik yoksa aynı notebook döner (geçmişe adım yazılmaz).

const GEOMETRY_KEYS = ['x', 'y', 'w', 'h', 'rotation']
const sameKeys = (a, b, keys) => keys.every((key) => a[key] === b[key])

function updateItems(notebook, pageId, update) {
  const index = notebook.pages.findIndex((p) => p.id === pageId)
  if (index < 0) return notebook
  const page = notebook.pages[index]
  const items = update(page.items)
  if (items === page.items) return notebook
  const pages = notebook.pages.map((p, i) => (i === index ? { ...p, items } : p))
  return { ...notebook, pages }
}

function updateItem(notebook, { pageId, itemId }, change) {
  return updateItems(notebook, pageId, (items) => {
    const index = items.findIndex((item) => item.id === itemId)
    if (index < 0) return items
    const next = change(items[index])
    if (next === items[index]) return items
    if (next === null) return items.filter((_, i) => i !== index)
    return items.map((item, i) => (i === index ? next : item))
  })
}

const photoLimitReached = (items, item) =>
  item.type === 'photo' && items.filter((existing) => existing.type === 'photo').length >= MAX_PHOTOS_PER_PAGE

function addItem(items, item) {
  if (items.some((existing) => existing.id === item.id)) return items
  if (photoLimitReached(items, item)) return items
  return [...items, clampItemToPage(item)]
}

// Nesne açık defterdeki karşı sayfaya geçer: kaynaktan çıkar, hedefin en üstüne eklenir.
// Yalnızca aynı açık defterdeki iki sayfa arasında olur. Hedefte 3 fotoğraf varsa nesne
// kendi sayfasında kalır ve o sayfanın içine itilir (karar 100).
function moveToPage(notebook, payload) {
  const from = notebook.pages.findIndex((p) => p.id === payload.pageId)
  const to = notebook.pages.findIndex((p) => p.id === payload.toPageId)
  const item = notebook.pages[from]?.items.find((i) => i.id === payload.itemId)
  const sameSpread = from >= 0 && to >= 0 && Math.floor(from / 2) === Math.floor(to / 2)
  if (!item || !sameSpread) return notebook
  if (photoLimitReached(notebook.pages[to].items, item)) {
    // x hedef sayfanın koordinatında geldi; kaynağa çevrilir, nesne cilt kenarında durur.
    const x = to > from ? payload.x + PAGE_W : payload.x - PAGE_W
    return updateItem(notebook, payload, (current) => transform(current, { ...payload, x }))
  }
  const moved = clampItemToPage({ ...item, ...pick(payload, GEOMETRY_KEYS) })
  const pages = notebook.pages.map((page, i) => {
    if (i === from) return { ...page, items: page.items.filter((existing) => existing !== item) }
    if (i === to) return { ...page, items: [...page.items, moved] }
    return page
  })
  return { ...notebook, pages }
}

function transform(item, payload) {
  const next = clampItemToPage({ ...item, ...pick(payload, GEOMETRY_KEYS) })
  return sameKeys(item, next, GEOMETRY_KEYS) ? item : next
}

function updateProps(item, props) {
  const merged = { ...item.props, ...props }
  if (item.type === 'text' && !String(merged.content ?? '').trim()) return null
  return sameKeys(item.props, merged, Object.keys(merged)) ? item : { ...item, props: merged }
}

// Yazının üst kenarı yerinde kalır; nesne sonra sayfaya geri itilir.
function measure(item, h) {
  if (item.type !== 'text' || !(h > 0)) return item
  const height = Math.round(h * 10) / 10
  if (height === item.h) return item
  const next = clampItemToPage({ ...item, h: height, y: item.y + (height - item.h) / 2 })
  return sameKeys(item, next, GEOMETRY_KEYS) ? item : next
}

function moveItem(items, itemId, toEnd) {
  const item = items.find((i) => i.id === itemId)
  const edge = toEnd ? items[items.length - 1] : items[0]
  if (!item || item === edge) return items
  const rest = items.filter((i) => i !== item)
  return toEnd ? [...rest, item] : [item, ...rest]
}

function pick(source, keys) {
  return Object.fromEntries(keys.filter((key) => Number.isFinite(source[key])).map((key) => [key, source[key]]))
}

export function reduceItems(notebook, { type, payload }) {
  switch (type) {
    case 'item/add':
      return updateItems(notebook, payload.pageId, (items) => addItem(items, payload.item))
    case 'item/delete':
      return updateItem(notebook, payload, () => null)
    case 'item/transform':
      if (payload.toPageId && payload.toPageId !== payload.pageId) return moveToPage(notebook, payload)
      return updateItem(notebook, payload, (item) => transform(item, payload))
    case 'item/updateProps':
      return updateItem(notebook, payload, (item) => updateProps(item, payload.props))
    case 'item/measure':
      return updateItem(notebook, payload, (item) => measure(item, payload.h))
    case 'item/bringToFront':
      return updateItems(notebook, payload.pageId, (items) => moveItem(items, payload.itemId, true))
    case 'item/sendToBack':
      return updateItems(notebook, payload.pageId, (items) => moveItem(items, payload.itemId, false))
    default:
      return notebook
  }
}

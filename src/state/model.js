import { SCHEMA_VERSION, TITLE_MAX } from './constants.js'

const ITEM_DEFAULTS = {
  photo: { w: 240, h: 290 },
  sticker: { w: 160, h: 160 },
  decoration: { w: 200, h: 80 },
  text: { w: 300, h: 60 },
}
const FONTS = ['hand', 'serif', 'typewriter']
const ALIGNS = ['left', 'center', 'right']

export function createId(prefix) {
  const time = Date.now().toString(36)
  const random = Math.random().toString(36).slice(2, 8)
  return `${prefix}_${time}${random}`
}

// Başlık verilmemiş sayfanın title alanı boştur. Ekranda sayfanın o anki sırası gösterilir.
export function displayTitle(page, index) {
  return page.title || `Sayfa ${index + 1}`
}

// Eski kayıtlara yazılmış "Sayfa N" başlıkları (karar 78).
const LEGACY_DEFAULT_TITLE = /^Sayfa \d+$/

export function createPage() {
  return { id: createId('pg'), title: '', items: [] }
}

export function createEmptyNotebook() {
  return { schemaVersion: SCHEMA_VERSION, pages: [createPage(), createPage()], updatedAt: 0 }
}

const isObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value)
const isNumber = (value) => typeof value === 'number' && Number.isFinite(value)
const numberOr = (value, fallback) => (isNumber(value) ? value : fallback)
const oneOf = (value, list) => (list.includes(value) ? value : list[0])

function freshId(id, prefix, usedIds, warnings) {
  if (typeof id === 'string' && id && !usedIds.has(id)) {
    usedIds.add(id)
    return id
  }
  const next = createId(prefix)
  usedIds.add(next)
  warnings.push(`Eksik ya da tekrar eden id yenilendi: ${String(id)} → ${next}`)
  return next
}

function normalizeProps(type, props) {
  const p = isObject(props) ? props : {}
  if (type === 'photo') {
    if (typeof p.src !== 'string' || !p.src) return null
    const caption = typeof p.caption === 'string' ? p.caption.slice(0, TITLE_MAX) : ''
    return { ...p, caption }
  }
  if (type === 'sticker') return typeof p.stickerId === 'string' ? p : null
  if (type === 'decoration') return typeof p.decorationId === 'string' ? p : null
  if (typeof p.content !== 'string' || !p.content.trim()) return null
  return {
    ...p,
    font: oneOf(p.font, FONTS),
    size: Math.min(72, Math.max(14, Math.round(numberOr(p.size, 24)))),
    bold: p.bold === true,
    italic: p.italic === true,
    align: oneOf(p.align, ALIGNS),
  }
}

function normalizeItem(raw, usedIds, warnings) {
  if (!isObject(raw) || !(raw.type in ITEM_DEFAULTS)) {
    warnings.push(`Tanınmayan nesne atlandı: ${JSON.stringify(raw)?.slice(0, 120)}`)
    return null
  }
  const props = normalizeProps(raw.type, raw.props)
  if (!props) {
    warnings.push(`Eksik içerikli ${raw.type} nesnesi atlandı.`)
    return null
  }
  const size = ITEM_DEFAULTS[raw.type]
  return {
    ...raw,
    id: freshId(raw.id, 'it', usedIds, warnings),
    x: numberOr(raw.x, 400),
    y: numberOr(raw.y, 500),
    w: numberOr(raw.w, size.w),
    h: numberOr(raw.h, size.h),
    rotation: numberOr(raw.rotation, 0),
    props,
  }
}

function normalizeTitle(title) {
  const clean = typeof title === 'string' ? title.trim().slice(0, TITLE_MAX) : ''
  return LEGACY_DEFAULT_TITLE.test(clean) ? '' : clean
}

function normalizePage(raw, usedIds, warnings) {
  const page = isObject(raw) ? raw : {}
  const title = normalizeTitle(page.title)
  const id = freshId(page.id, 'pg', usedIds, warnings)
  const rawItems = Array.isArray(page.items) ? page.items : []
  const items = rawItems
    .map((item) => normalizeItem(item, usedIds, warnings))
    .filter(Boolean)
  return { ...page, id, title, items }
}

// Kayıt yalnızca okunamıyorsa null döner (SPEC 4.2, karar 47). Eksik alanlar tamamlanır.
export function normalizeNotebook(raw) {
  if (!isObject(raw) || raw.schemaVersion !== SCHEMA_VERSION || !Array.isArray(raw.pages)) {
    return null
  }
  const warnings = []
  const usedIds = new Set()
  const pages = raw.pages.map((page) => normalizePage(page, usedIds, warnings))
  if (pages.length === 0) {
    pages.push(createPage())
    warnings.push('Sayfa yoktu, bir boş sayfa eklendi.')
  }
  const notebook = { ...raw, pages, updatedAt: numberOr(raw.updatedAt, 0) }
  return { notebook, warnings }
}

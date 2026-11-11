import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createInitialUi, reconcileUi, uiReducer } from '../src/state/uiReducer.js'

const item = (id) => ({ id, type: 'text', x: 0, y: 0, w: 40, h: 40, rotation: 0, props: {} })
const page = (id, items = []) => ({ id, title: id, items })
const book = (...pages) => ({ schemaVersion: 1, pages, updatedAt: 0 })
const nb4 = book(page('a', [item('i1')]), page('b'), page('c', [item('i3')]), page('d'))
const run = (ui, type, payload, nb = nb4) => uiReducer(ui, { type, payload }, nb)

test('başlangıç: spreadIndex sayfa sayısına göre sınırlanır, aktif sayfa sol sayfa', () => {
  const ui = createInitialUi(nb4, { spreadIndex: 9, panelTab: 'decorations' })
  assert.equal(ui.spreadIndex, 1)
  assert.equal(ui.activePageId, 'c')
  assert.equal(ui.panelTab, 'decorations')
  assert.equal(ui.lastLibraryTab, 'decorations')
  assert.equal(createInitialUi(nb4, { spreadIndex: -2, panelTab: 'x' }).panelTab, 'stickers')
})

test('ui/setSpread aktif sayfayı sol sayfa yapar ve seçimi kaldırır', () => {
  const selected = run(createInitialUi(nb4), 'ui/select', { itemId: 'i1', pageId: 'a' })
  const ui = run(selected, 'ui/setSpread', { spreadIndex: 1 })
  assert.equal(ui.activePageId, 'c')
  assert.equal(ui.selectedItemId, null)
  assert.equal(ui.panelTab, 'stickers')
})

test('panel: seçimde Özellikler açılır, seçim kalkınca son kütüphane sekmesine döner', () => {
  let ui = run(createInitialUi(nb4), 'ui/setPanelTab', { tab: 'decorations' })
  ui = run(ui, 'ui/select', { itemId: 'i1', pageId: 'a' })
  assert.equal(ui.panelTab, 'properties')
  assert.equal(ui.lastLibraryTab, 'decorations')
  ui = run(ui, 'ui/deselect')
  assert.equal(ui.panelTab, 'decorations')
})

test('panel: seçim dururken kütüphane sekmesi açılır, Özellikler ile geri dönülür', () => {
  let ui = run(createInitialUi(nb4), 'ui/select', { itemId: 'i1', pageId: 'a' })
  ui = run(ui, 'ui/setPanelTab', { tab: 'decorations' })
  assert.equal(ui.panelTab, 'decorations')
  assert.equal(ui.selectedItemId, 'i1')
  ui = run(ui, 'ui/setPanelTab', { tab: 'properties' })
  assert.equal(ui.panelTab, 'properties')
})

test('panel: seçim yokken Özellikler sekmesi açılmaz', () => {
  const ui = createInitialUi(nb4)
  assert.equal(run(ui, 'ui/setPanelTab', { tab: 'properties' }), ui)
})

test('page/add yeni sayfayı aktif yapar ve açık defterine geçer', () => {
  const nb = book(page('a'), page('b'), page('c'))
  const ui = run(createInitialUi(nb), 'page/add', { page: { id: 'c' } }, nb)
  assert.equal(ui.spreadIndex, 1)
  assert.equal(ui.activePageId, 'c')
})

test('reconcileUi: değişiklik yoksa aynı nesne döner', () => {
  const ui = createInitialUi(nb4)
  assert.equal(reconcileUi(ui, { prev: nb4, next: nb4 }), ui)
})

test('reconcileUi: silinen nesneyi gösteren seçim ve düzenleme temizlenir', () => {
  const ui = run(run(createInitialUi(nb4), 'ui/select', { itemId: 'i1', pageId: 'a' }), 'ui/startEdit', { itemId: 'i1' })
  const next = book(page('a'), page('b'), page('c'), page('d'))
  const result = reconcileUi(ui, { prev: nb4, next })
  assert.equal(result.selectedItemId, null)
  assert.equal(result.editingItemId, null)
  assert.equal(result.panelTab, 'stickers')
})

test('reconcileUi: silinen aktif sayfa yerine aynı sıradaki sayfa gelir', () => {
  const ui = { ...createInitialUi(nb4, { spreadIndex: 1 }), activePageId: 'c' }
  const next = book(page('a'), page('b'), page('d'))
  const result = reconcileUi(ui, { prev: nb4, next })
  assert.equal(result.activePageId, 'd')
  assert.equal(result.spreadIndex, 1)
})

test('reconcileUi: sıra artık yoksa son sayfa aktif olur ve açık defter sınırlanır', () => {
  const ui = { ...createInitialUi(nb4, { spreadIndex: 1 }), activePageId: 'd' }
  const next = book(page('a'), page('b'), page('c'))
  const result = reconcileUi(ui, { prev: nb4, next })
  assert.equal(result.activePageId, 'c')
  assert.equal(result.spreadIndex, 1)
  const shorter = book(page('a'), page('b'))
  const r2 = reconcileUi({ ...ui, activePageId: 'c' }, { prev: nb4, next: shorter })
  assert.equal(r2.spreadIndex, 0)
  assert.equal(r2.activePageId, 'b')
})

test('reconcileUi: undo sonrası değişen sayfanın açık defterine geçilir', () => {
  const ui = createInitialUi(nb4)
  const result = reconcileUi(ui, { prev: nb4, next: nb4, focusPageId: 'd' })
  assert.equal(result.spreadIndex, 1)
  assert.equal(result.activePageId, 'd')
})

test('reconcileUi: undo ile kaldırılan sayfa için en yakın sayfaya gidilir', () => {
  const ui = createInitialUi(nb4, { spreadIndex: 1 })
  const next = book(page('a'), page('b'), page('c'))
  const result = reconcileUi({ ...ui, activePageId: 'd' }, { prev: nb4, next, focusPageId: 'd' })
  assert.equal(result.activePageId, 'c')
  assert.equal(result.spreadIndex, 1)
})

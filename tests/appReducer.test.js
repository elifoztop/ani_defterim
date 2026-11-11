import { test } from 'node:test'
import assert from 'node:assert/strict'
import { appReducer, createInitialState } from '../src/state/appReducer.js'
import { createEmptyNotebook, createPage, displayTitle } from '../src/state/model.js'
import { addLibraryItemAction, addTextAction } from '../src/state/actions.js'
import { createMemoryStorage, loadNotebook, loadPrefs, saveNotebook, savePrefs } from '../src/state/storage.js'

const act = (state, type, payload) => appReducer(state, { type, payload })
const titles = (state) => state.history.present.pages.map((p) => p.title)
const shown = (state) => state.history.present.pages.map(displayTitle)
const idAt = (state, index) => state.history.present.pages[index].id

function addPages(state, count) {
  let next = state
  for (let i = 0; i < count; i += 1) {
    next = act(next, 'page/add', { page: createPage() })
  }
  return next
}

test('Aşama 2 senaryosu: 5 sayfa ekle, başlık ver, birini sil, yeniden aç', () => {
  let state = createInitialState(createEmptyNotebook(), {})
  state = addPages(state, 5)
  assert.equal(state.history.present.pages.length, 7)
  assert.equal(state.ui.spreadIndex, 3)

  const third = state.history.present.pages[2]
  state = act(state, 'page/rename', { pageId: third.id, title: 'Tatil' })
  const fifth = state.history.present.pages[4]
  state = act(state, 'page/delete', { pageId: fifth.id })
  assert.deepEqual(titles(state), ['', '', 'Tatil', '', '', ''])
  assert.deepEqual(shown(state), ['Sayfa 1', 'Sayfa 2', 'Tatil', 'Sayfa 4', 'Sayfa 5', 'Sayfa 6'])

  const storage = createMemoryStorage()
  saveNotebook(storage, state.history.present)
  savePrefs(storage, { spreadIndex: state.ui.spreadIndex, panelTab: state.ui.lastLibraryTab })
  const reopened = createInitialState(loadNotebook(storage).notebook, loadPrefs(storage))
  assert.deepEqual(titles(reopened), titles(state))
  assert.deepEqual(shown(reopened), shown(state))
  assert.equal(reopened.ui.spreadIndex, state.ui.spreadIndex)
})

test('hata senaryosu: 8 sayfa, 2. ve 5. sayfayı sil, 2 sayfa ekle: numaralar tekrar etmez', () => {
  let state = addPages(createInitialState(createEmptyNotebook(), {}), 6)
  assert.equal(state.history.present.pages.length, 8)
  const second = idAt(state, 1)
  const fifth = idAt(state, 4)
  state = act(state, 'page/delete', { pageId: second })
  state = act(state, 'page/delete', { pageId: fifth })
  state = addPages(state, 2)
  assert.deepEqual(titles(state), Array(8).fill(''))
  assert.deepEqual(shown(state), Array.from({ length: 8 }, (_, i) => `Sayfa ${i + 1}`))
})

test('hata senaryosu özel başlıkla: özel başlık korunur, diğerleri sırayı gösterir', () => {
  let state = addPages(createInitialState(createEmptyNotebook(), {}), 6)
  state = act(state, 'page/rename', { pageId: idAt(state, 2), title: 'Tatil' })
  state = act(state, 'page/delete', { pageId: idAt(state, 1) })
  state = act(state, 'page/delete', { pageId: idAt(state, 3) })
  state = addPages(state, 2)
  assert.deepEqual(shown(state), ['Sayfa 1', 'Tatil', 'Sayfa 3', 'Sayfa 4', 'Sayfa 5', 'Sayfa 6', 'Sayfa 7', 'Sayfa 8'])
  state = act(state, 'history/undo')
  state = act(state, 'history/undo')
  state = act(state, 'history/undo')
  assert.deepEqual(shown(state), ['Sayfa 1', 'Tatil', 'Sayfa 3', 'Sayfa 4', 'Sayfa 5', 'Sayfa 6', 'Sayfa 7'])
})

test('eski kayıt geçişi: "Sayfa N" başlıklı eski kayıt açılınca numaralar sırayı izler', () => {
  const storage = createMemoryStorage()
  storage.setItem('ad:notebook:v1', JSON.stringify({
    schemaVersion: 1,
    pages: [{ id: 'a', title: 'Sayfa 8' }, { id: 'b', title: 'Sayfa 2' }, { id: 'c', title: 'Okul' }, { id: 'd', title: 'Sayfa 2' }],
  }))
  const { notebook, status } = loadNotebook(storage)
  assert.equal(status, 'ok')
  assert.deepEqual(notebook.pages.map((p) => p.title), ['', '', 'Okul', ''])
  assert.deepEqual(notebook.pages.map(displayTitle), ['Sayfa 1', 'Sayfa 2', 'Okul', 'Sayfa 4'])
})

test('8 sayfa sınırı: dokuzuncu ekleme durumu değiştirmez', () => {
  const state = addPages(createInitialState(createEmptyNotebook(), {}), 6)
  assert.equal(act(state, 'page/add', { page: createPage() }), state)
})

test('sayfa silmenin geri alınması sayfayı ve açık defterini geri getirir', () => {
  let state = addPages(createInitialState(createEmptyNotebook(), {}), 2)
  const target = state.history.present.pages[3]
  state = act(state, 'page/delete', { pageId: target.id })
  state = act(state, 'ui/setSpread', { spreadIndex: 0 })
  state = act(state, 'history/undo')
  assert.equal(state.history.present.pages[3].id, target.id)
  assert.equal(state.ui.spreadIndex, 1)
  assert.equal(state.ui.activePageId, target.id)
})

test('sayfa eklemenin geri alınması son sayfaya döner', () => {
  let state = addPages(createInitialState(createEmptyNotebook(), {}), 1)
  assert.equal(state.ui.spreadIndex, 1)
  state = act(state, 'history/undo')
  assert.equal(state.history.present.pages.length, 2)
  assert.equal(state.ui.spreadIndex, 0)
  assert.equal(state.ui.activePageId, state.history.present.pages[1].id)
})

test('undo sonrası açık defter değiştirmek odaklamayı tekrar tetiklemez', () => {
  let state = addPages(createInitialState(createEmptyNotebook(), {}), 2)
  const first = state.history.present.pages[0]
  state = act(state, 'page/rename', { pageId: first.id, title: 'Kapak' })
  state = act(state, 'ui/setSpread', { spreadIndex: 1 })
  state = act(state, 'history/undo')
  assert.equal(state.ui.spreadIndex, 0)
  state = act(state, 'ui/setSpread', { spreadIndex: 1 })
  assert.equal(state.ui.spreadIndex, 1)
})

test('UI eylemleri geçmişe girmez', () => {
  let state = addPages(createInitialState(createEmptyNotebook(), {}), 2)
  const pastLength = state.history.past.length
  state = act(state, 'ui/setSpread', { spreadIndex: 0 })
  state = act(state, 'ui/setPanelTab', { tab: 'decorations' })
  assert.equal(state.history.past.length, pastLength)
})

const STAR = { id: 'star', kind: 'sticker', size: { w: 140, h: 140 } }
const pageItems = (state, index = 0) => state.history.present.pages[index].items

test('yazı ekle: nesne seçilir, düzenleme modunda açılır, panel Özellikler olur', () => {
  let state = createInitialState(createEmptyNotebook(), {})
  state = appReducer(state, addTextAction(state.ui.activePageId))
  const id = pageItems(state)[0].id
  assert.equal(state.ui.selectedItemId, id)
  assert.equal(state.ui.editingItemId, id)
  assert.equal(state.ui.panelTab, 'properties')
})

test('seçili nesne silinince seçim kalkar ve panel son kütüphane sekmesine döner', () => {
  let state = createInitialState(createEmptyNotebook(), { panelTab: 'decorations' })
  state = appReducer(state, addLibraryItemAction(state.ui.activePageId, STAR))
  const id = pageItems(state)[0].id
  state = act(state, 'item/delete', { pageId: state.ui.activePageId, itemId: id })
  assert.equal(state.ui.selectedItemId, null)
  assert.equal(state.ui.panelTab, 'decorations')
})

test('5 eylem, 5 geri al, 5 yinele: durum doğru (kabul testi 8)', () => {
  let state = createInitialState(createEmptyNotebook(), {})
  const pageId = state.ui.activePageId
  state = appReducer(state, addLibraryItemAction(pageId, STAR, () => 0.5))
  const itemId = pageItems(state)[0].id
  const target = { pageId, itemId }
  state = act(state, 'item/transform', { ...target, x: 200, y: 200, w: 140, h: 140, rotation: 0 })
  state = act(state, 'item/transform', { ...target, x: 200, y: 200, w: 200, h: 200, rotation: 0 })
  state = act(state, 'item/transform', { ...target, x: 200, y: 200, w: 200, h: 200, rotation: 30 })
  state = appReducer(state, addTextAction(pageId))
  const final = state.history.present
  for (let i = 0; i < 5; i += 1) state = act(state, 'history/undo')
  assert.equal(pageItems(state).length, 0)
  for (let i = 0; i < 5; i += 1) state = act(state, 'history/redo')
  assert.deepEqual(state.history.present, final)
})

test('item/measure yeni adım açmaz, yinele geçmişini silmez', () => {
  let state = createInitialState(createEmptyNotebook(), {})
  const pageId = state.ui.activePageId
  state = appReducer(state, addTextAction(pageId))
  const itemId = pageItems(state)[0].id
  state = act(state, 'item/updateProps', { pageId, itemId, props: { size: 60 } })
  state = act(state, 'history/undo')
  const { past, future } = state.history
  state = act(state, 'item/measure', { pageId, itemId, h: 80 })
  assert.equal(pageItems(state)[0].h, 80)
  assert.equal(state.history.past, past)
  assert.equal(state.history.future, future)
})

test('başka açık defterdeki nesnenin değişikliği geri alınınca o açık deftere geçilir', () => {
  let state = createInitialState(createEmptyNotebook(), {})
  const firstPage = state.ui.activePageId
  state = appReducer(state, addLibraryItemAction(firstPage, STAR))
  const itemId = pageItems(state)[0].id
  state = act(state, 'item/transform', { pageId: firstPage, itemId, x: 300, y: 300, w: 140, h: 140, rotation: 0 })
  state = addPages(state, 2)
  assert.equal(state.ui.spreadIndex, 1)
  state = act(state, 'history/undo')
  state = act(state, 'history/undo')
  state = act(state, 'history/undo')
  assert.equal(state.ui.spreadIndex, 0)
  assert.equal(state.ui.activePageId, firstPage)
  assert.equal(pageItems(state)[0].x, 400)
})

test('karşı sayfaya geçiş tek geri al adımıdır; aktif sayfa ve seçim nesneyle gider', () => {
  let state = createInitialState(createEmptyNotebook(), {})
  const [left, right] = state.history.present.pages.map((p) => p.id)
  state = appReducer(state, addLibraryItemAction(left, STAR, () => 0.5))
  const itemId = pageItems(state)[0].id
  const steps = state.history.past.length
  state = act(state, 'item/transform', { pageId: left, itemId, x: 300, y: 400, w: 140, h: 140, rotation: 0, toPageId: right })
  assert.equal(pageItems(state, 1)[0].id, itemId)
  assert.equal(state.ui.activePageId, right)
  assert.equal(state.ui.selectedItemId, itemId)
  assert.equal(state.history.past.length, steps + 1)
  state = act(state, 'history/undo')
  assert.equal(pageItems(state, 0)[0].id, itemId)
  assert.equal(pageItems(state, 1).length, 0)
})

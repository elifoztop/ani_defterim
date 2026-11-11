import { test } from 'node:test'
import assert from 'node:assert/strict'
import { canRedo, canUndo, createHistory, findChangedPageId, historyReducer } from '../src/state/history.js'

// Sahte reducer: tek sayfalı bir defter, sayfada bir sayaç (n) var.
const nb = (n) => ({ pages: [{ id: 'p', n }] })
const value = (h) => h.present.pages[0].n
const reduce = historyReducer((state, action) => {
  if (action.type === 'add') return action.payload === 0 ? state : nb(value({ present: state }) + action.payload)
  if (action.type === 'item/measure') return nb(action.payload)
  return state
})
const apply = (h, ...actions) => actions.reduce(reduce, h)
const start = () => createHistory(nb(0))
const add = (payload) => ({ type: 'add', payload })
const UNDO = { type: 'history/undo' }
const REDO = { type: 'history/redo' }

test('undo ve redo durumu geri getirir', () => {
  const h = apply(start(), add(1), add(2))
  assert.equal(value(h), 3)
  assert.equal(value(apply(h, UNDO)), 1)
  assert.equal(value(apply(h, UNDO, UNDO)), 0)
  assert.equal(value(apply(h, UNDO, UNDO, REDO, REDO)), 3)
})

test('boş geçmişte undo ve redo aynı nesneyi döndürür', () => {
  const h = start()
  assert.equal(reduce(h, UNDO), h)
  assert.equal(reduce(h, REDO), h)
  assert.equal(canUndo(h), false)
  assert.equal(canRedo(h), false)
})

test('geçmiş en fazla 30 adım tutar', () => {
  const h = apply(start(), ...Array.from({ length: 35 }, () => add(1)))
  assert.equal(h.past.length, 30)
  assert.equal(value(apply(h, ...Array.from({ length: 40 }, () => UNDO))), 5)
})

test('yeni eylem future listesini boşaltır', () => {
  const h = apply(start(), add(1), add(1), UNDO, add(5))
  assert.equal(value(h), 6)
  assert.equal(canRedo(h), false)
})

test('değişiklik üretmeyen eylem geçmişe yazılmaz', () => {
  const h = apply(start(), add(1))
  assert.equal(reduce(h, add(0)), h)
})

test('item/measure past ve future listesini değiştirmez', () => {
  const h = apply(start(), add(1), add(1), UNDO)
  const measured = reduce(h, { type: 'item/measure', payload: 42 })
  assert.equal(value(measured), 42)
  assert.equal(measured.past, h.past)
  assert.equal(measured.future, h.future)
  assert.equal(measured.lastChangedPageId, h.lastChangedPageId)
})

test('findChangedPageId değişen, eklenen ya da silinen sayfayı bulur', () => {
  const a = { id: 'a' }
  const b = { id: 'b' }
  const before = { pages: [a, b] }
  assert.equal(findChangedPageId(before, { pages: [a, { id: 'b' }] }), 'b')
  assert.equal(findChangedPageId(before, { pages: [a, b, { id: 'c' }] }), 'c')
  assert.equal(findChangedPageId(before, { pages: [a] }), 'b')
  assert.equal(findChangedPageId(before, before), null)
})

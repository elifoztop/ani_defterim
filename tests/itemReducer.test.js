import { test } from 'node:test'
import assert from 'node:assert/strict'
import { notebookReducer } from '../src/state/notebookReducer.js'
import { addLibraryItemAction, addTextAction } from '../src/state/actions.js'
import { normalizeNotebook } from '../src/state/model.js'
import { rotatedHalfExtents } from '../src/lib/geometry.js'

const item = (id, extra = {}) => ({ id, type: 'sticker', x: 400, y: 500, w: 100, h: 100, rotation: 0, props: { stickerId: 'star' }, ...extra })
const text = (id, extra = {}) => item(id, { type: 'text', h: 60, props: { content: 'Not', font: 'hand', size: 24, bold: false, italic: false, align: 'left' }, ...extra })
const book = (...items) => ({ schemaVersion: 1, pages: [{ id: 'p', title: '', items }], updatedAt: 0 })
const run = (nb, type, payload) => notebookReducer(nb, { type, payload: { pageId: 'p', ...payload } })
const items = (nb) => nb.pages[0].items

test('item/add nesneyi sona ekler ve sayfaya sıkıştırır', () => {
  const next = run(book(), 'item/add', { item: item('a', { x: -100 }) })
  assert.equal(items(next).length, 1)
  assert.equal(items(next)[0].x, 50)
})

test('item/add sayfa başına en fazla 3 fotoğraf kabul eder', () => {
  const photo = (id) => item(id, { type: 'photo', props: { src: 'data:', caption: '' } })
  const nb = book(photo('1'), photo('2'), photo('3'))
  assert.equal(run(nb, 'item/add', { item: photo('4') }), nb)
  assert.equal(items(run(nb, 'item/add', { item: item('s') })).length, 4)
})

test('item/delete nesneyi siler', () => {
  assert.deepEqual(items(run(book(item('a'), item('b')), 'item/delete', { itemId: 'a' })).map((i) => i.id), ['b'])
})

test('item/transform konumu, boyutu ve açıyı yazar; sayfa dışına çıkarmaz', () => {
  const next = run(book(item('a')), 'item/transform', { itemId: 'a', x: 900, y: 300, w: 120, h: 120, rotation: 200 })
  const moved = items(next)[0]
  assert.equal(moved.rotation, -160)
  assert.equal(moved.x + rotatedHalfExtents(120, 120, -160).hx, 800)
  assert.equal(moved.y, 300)
})

test('item/transform aynı değerlerde durumu değiştirmez', () => {
  const nb = book(item('a'))
  assert.equal(run(nb, 'item/transform', { itemId: 'a', x: 400, y: 500, w: 100, h: 100, rotation: 0 }), nb)
})

test('item/updateProps özellikleri birleştirir', () => {
  const next = run(book(text('t')), 'item/updateProps', { itemId: 't', props: { bold: true, font: 'serif' } })
  assert.equal(items(next)[0].props.bold, true)
  assert.equal(items(next)[0].props.content, 'Not')
})

test('item/updateProps aynı değerde durumu değiştirmez', () => {
  const nb = book(text('t'))
  assert.equal(run(nb, 'item/updateProps', { itemId: 't', props: { content: 'Not' } }), nb)
})

test('yazı içeriği boş kalırsa nesne silinir', () => {
  assert.equal(items(run(book(text('t')), 'item/updateProps', { itemId: 't', props: { content: '  \n ' } })).length, 0)
})

test('item/measure yüksekliği yazar, üst kenar yerinde kalır', () => {
  const next = run(book(text('t', { y: 200, h: 60 })), 'item/measure', { itemId: 't', h: 100 })
  const t = items(next)[0]
  assert.equal(t.h, 100)
  assert.equal(t.y - t.h / 2, 200 - 30)
})

test('item/measure nesneyi sayfaya geri iter ve aynı yükseklikte değişmez', () => {
  const nb = book(text('t', { y: 960, h: 60 }))
  const t = items(run(nb, 'item/measure', { itemId: 't', h: 200 }))[0]
  assert.equal(t.y, 900)
  assert.equal(run(nb, 'item/measure', { itemId: 't', h: 60 }), nb)
  assert.equal(run(book(item('s')), 'item/measure', { itemId: 's', h: 300 }).pages[0].items[0].h, 100)
})

test('öne getir ve arkaya gönder dizideki sırayı değiştirir', () => {
  const nb = book(item('a'), item('b'), item('c'))
  assert.deepEqual(items(run(nb, 'item/bringToFront', { itemId: 'a' })).map((i) => i.id), ['b', 'c', 'a'])
  assert.deepEqual(items(run(nb, 'item/sendToBack', { itemId: 'c' })).map((i) => i.id), ['c', 'a', 'b'])
  assert.equal(run(nb, 'item/bringToFront', { itemId: 'c' }), nb)
  assert.equal(run(nb, 'item/sendToBack', { itemId: 'a' }), nb)
})

test('olmayan nesne ya da sayfa için durum değişmez', () => {
  const nb = book(item('a'))
  assert.equal(run(nb, 'item/delete', { itemId: 'x' }), nb)
  assert.equal(notebookReducer(nb, { type: 'item/delete', payload: { pageId: 'yok', itemId: 'a' } }), nb)
})

test('eylem oluşturucular: yazı varsayılanı ve çıkartmanın -4..+4 açısı', () => {
  const t = addTextAction('p').payload.item
  assert.equal(t.type, 'text')
  assert.equal(t.props.content, 'Notunu yaz…')
  const entry = { id: 'star', kind: 'sticker', size: { w: 140, h: 140 } }
  assert.equal(addLibraryItemAction('p', entry, () => 0).payload.item.rotation, -4)
  assert.equal(addLibraryItemAction('p', entry, () => 1).payload.item.rotation, 4)
  const deco = addLibraryItemAction('p', { id: 'stamp', kind: 'decoration', size: { w: 130, h: 160 } }, () => 0.5)
  assert.deepEqual(deco.payload.item.props, { decorationId: 'stamp' })
  assert.equal(deco.payload.item.w, 130)
})

test('açılışta sayfa dışındaki nesne sayfaya geri itilir', () => {
  const { notebook } = normalizeNotebook({ schemaVersion: 1, pages: [{ id: 'p', items: [item('a', { x: 5000 })] }] })
  assert.equal(notebook.pages[0].items[0].x, 750)
})

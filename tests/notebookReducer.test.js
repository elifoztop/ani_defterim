import { test } from 'node:test'
import assert from 'node:assert/strict'
import { notebookReducer } from '../src/state/notebookReducer.js'

const page = (id, title = id) => ({ id, title, items: [] })
const book = (...ids) => ({ schemaVersion: 1, pages: ids.map((id) => page(id)), updatedAt: 0 })
const run = (nb, type, payload) => notebookReducer(nb, { type, payload })

test('page/add sayfayı sona ekler', () => {
  const next = run(book('a', 'b'), 'page/add', { page: page('c') })
  assert.deepEqual(next.pages.map((p) => p.id), ['a', 'b', 'c'])
})

test('page/add 8 sayfada ve tekrar eden id ile durumu değiştirmez', () => {
  const full = book('1', '2', '3', '4', '5', '6', '7', '8')
  assert.equal(run(full, 'page/add', { page: page('9') }), full)
  const nb = book('a')
  assert.equal(run(nb, 'page/add', { page: page('a') }), nb)
})

test('page/delete sayfayı siler, diğer sayfaların referansı korunur', () => {
  const nb = book('a', 'b', 'c')
  const next = run(nb, 'page/delete', { pageId: 'b' })
  assert.deepEqual(next.pages.map((p) => p.id), ['a', 'c'])
  assert.equal(next.pages[0], nb.pages[0])
})

test('page/delete son sayfayı ve olmayan sayfayı silmez', () => {
  const one = book('a')
  assert.equal(run(one, 'page/delete', { pageId: 'a' }), one)
  const two = book('a', 'b')
  assert.equal(run(two, 'page/delete', { pageId: 'zz' }), two)
})

test('page/rename başlığı kırpar ve 40 karakterle sınırlar', () => {
  const nb = book('a', 'b')
  assert.equal(run(nb, 'page/rename', { pageId: 'b', title: '  Tatil  ' }).pages[1].title, 'Tatil')
  assert.equal(run(nb, 'page/rename', { pageId: 'a', title: 'x'.repeat(50) }).pages[0].title.length, 40)
})

test('page/rename boş bırakılan başlığı boş metin olarak kaydeder', () => {
  const nb = book('a', 'b')
  assert.equal(run(nb, 'page/rename', { pageId: 'b', title: '   ' }).pages[1].title, '')
})

test('sayfa ekleme ve silme kullanıcının verdiği başlıklara dokunmaz', () => {
  let nb = run(book('a', 'b', 'c'), 'page/rename', { pageId: 'c', title: 'Tatil' })
  nb = run(nb, 'page/delete', { pageId: 'a' })
  nb = run(nb, 'page/add', { page: page('d', '') })
  assert.deepEqual(nb.pages.map((p) => p.title), ['b', 'Tatil', ''])
})

test('page/rename aynı başlıkta durumu değiştirmez', () => {
  const nb = book('a')
  assert.equal(run(nb, 'page/rename', { pageId: 'a', title: 'a' }), nb)
})

test('bilinmeyen eylem durumu değiştirmez', () => {
  const nb = book('a')
  assert.equal(run(nb, 'bilinmeyen', {}), nb)
})

import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  MAX_PHOTO_BYTES,
  canAddPhoto,
  checkPhotoFile,
  dataUrlBytes,
  polaroidSize,
  scaledSize,
} from '../src/lib/photoRules.js'
import { addPhotoAction } from '../src/state/actions.js'
import { notebookReducer } from '../src/state/notebookReducer.js'
import { createMemoryStorage, getUsage, saveNotebook, wouldExceed } from '../src/state/storage.js'

const MB = 1024 * 1024
const photo = (id) => ({ id, type: 'photo', x: 400, y: 500, w: 240, h: 290, rotation: 0, props: { src: 'data:', caption: '' } })

test('PNG, JPG ve WEBP kabul edilir', () => {
  for (const type of ['image/png', 'image/jpeg', 'image/webp']) {
    assert.equal(checkPhotoFile({ type, size: MB }), null)
  }
})

test('.gif ve tanınmayan tür reddedilir (kabul testi 11)', () => {
  assert.equal(checkPhotoFile({ type: 'image/gif', size: MB }), 'type')
  assert.equal(checkPhotoFile({ type: '', size: MB }), 'type')
})

test('15 MB üstü reddedilir, tam 15 MB kabul edilir (kabul testi 11)', () => {
  assert.equal(checkPhotoFile({ type: 'image/jpeg', size: 20 * MB }), 'size')
  assert.equal(checkPhotoFile({ type: 'image/jpeg', size: MAX_PHOTO_BYTES }), null)
  assert.equal(checkPhotoFile({ type: 'image/jpeg', size: MAX_PHOTO_BYTES + 1 }), 'size')
})

test('sayfada 3 fotoğraf varsa yenisi eklenemez (kabul testi 10)', () => {
  assert.equal(canAddPhoto({ items: [photo('1'), photo('2')] }), true)
  assert.equal(canAddPhoto({ items: [photo('1'), photo('2'), photo('3')] }), false)
  assert.equal(canAddPhoto(undefined), false)
})

test('uzun kenar 600 piksele küçültülür, küçük görsel büyütülmez', () => {
  assert.deepEqual(scaledSize(3000, 2000), { width: 600, height: 400 })
  assert.deepEqual(scaledSize(1000, 4000), { width: 150, height: 600 })
  assert.deepEqual(scaledSize(300, 200), { width: 300, height: 200 })
})

test('dataUrlBytes base64 boyutunu hesaplar', () => {
  assert.equal(dataUrlBytes('data:image/jpeg;base64,AAAA'), 3)
  assert.equal(dataUrlBytes(`data:image/jpeg;base64,${'A'.repeat(4000)}`), 3000)
})

test('polaroid boyutu: yatay 280, dikey 220 genişlik; alt kenar daha geniş', () => {
  const landscape = polaroidSize(600, 400)
  assert.equal(landscape.w, 280)
  assert.equal(landscape.h, Math.round((280 * 0.28 + 280 * 0.88 * (400 / 600)) * 10) / 10)
  assert.equal(polaroidSize(400, 600).w, 220)
})

test('addPhotoAction polaroid boyutlu, notu boş bir fotoğraf ekler', () => {
  const action = addPhotoAction('p', { src: 'data:image/jpeg;base64,AA', width: 600, height: 600 })
  const { item } = action.payload
  assert.equal(item.type, 'photo')
  assert.deepEqual(item.props, { src: 'data:image/jpeg;base64,AA', caption: '' })
  assert.equal(item.w, 280)
  const book = { schemaVersion: 1, pages: [{ id: 'p', title: '', items: [] }], updatedAt: 0 }
  assert.equal(notebookReducer(book, action).pages[0].items.length, 1)
})

test('fotoğraf eklemek doluluğu artırır; %90 sınırı aşılacaksa engellenir', () => {
  const storage = createMemoryStorage()
  const book = { schemaVersion: 1, pages: [{ id: 'p', title: '', items: [] }], updatedAt: 0 }
  saveNotebook(storage, book)
  const before = getUsage(storage)
  const src = `data:image/jpeg;base64,${'A'.repeat(100_000)}`
  saveNotebook(storage, notebookReducer(book, addPhotoAction('p', { src, width: 600, height: 400 })))
  assert.ok(getUsage(storage) > before + 100_000)
  assert.equal(wouldExceed(storage, 4_400_000, 0.9), true)
  assert.equal(wouldExceed(storage, 100_000, 0.9), false)
})

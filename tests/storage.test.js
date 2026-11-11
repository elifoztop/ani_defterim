import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  createMemoryStorage,
  getUsage,
  isNotebookKey,
  loadNotebook,
  loadPrefs,
  saveNotebook,
  savePrefs,
  usageRatio,
  wouldExceed,
} from '../src/state/storage.js'
import { CORRUPT_KEY, NOTEBOOK_KEY, PREFS_KEY } from '../src/state/constants.js'

const notebook = {
  schemaVersion: 1,
  pages: [{ id: 'pg_1', title: 'Tatil', items: [] }, { id: 'pg_2', title: 'Okul', items: [] }],
  updatedAt: 0,
}

test('kayıt yoksa boş defter döner, durum "empty"', () => {
  const result = loadNotebook(createMemoryStorage())
  assert.equal(result.status, 'empty')
  assert.equal(result.notebook.pages.length, 2)
})

test('kaydedilen defter aynen geri okunur, updatedAt yazılır', () => {
  const storage = createMemoryStorage()
  assert.deepEqual(saveNotebook(storage, notebook, 1234), { ok: true })
  const result = loadNotebook(storage)
  assert.equal(result.status, 'ok')
  assert.deepEqual(result.notebook, { ...notebook, updatedAt: 1234 })
})

test('JSON hatası bozuk sayılır, veri tek yedek anahtara taşınır', () => {
  const storage = createMemoryStorage()
  storage.setItem(NOTEBOOK_KEY, '{bozuk')
  const result = loadNotebook(storage)
  assert.equal(result.status, 'corrupt')
  assert.equal(result.notebook.pages.length, 2)
  assert.equal(storage.getItem(CORRUPT_KEY), '{bozuk')
  assert.equal(storage.getItem(NOTEBOOK_KEY), null)
})

test('yeni bozuk veri eski yedeğin üzerine yazılır', () => {
  const storage = createMemoryStorage()
  storage.setItem(CORRUPT_KEY, 'eski')
  storage.setItem(NOTEBOOK_KEY, JSON.stringify({ schemaVersion: 7, pages: [] }))
  loadNotebook(storage)
  assert.equal(storage.getItem(CORRUPT_KEY), JSON.stringify({ schemaVersion: 7, pages: [] }))
  const keys = Array.from({ length: storage.length }, (_, i) => storage.key(i))
  assert.deepEqual(keys, [CORRUPT_KEY])
})

test('eski biçimli kayıt bozuk sayılmaz ve yerinde kalır', () => {
  const storage = createMemoryStorage()
  const old = JSON.stringify({ schemaVersion: 1, pages: [{ id: 'p1' }, { title: 'İkinci' }] })
  storage.setItem(NOTEBOOK_KEY, old)
  const result = loadNotebook(storage)
  assert.equal(result.status, 'ok')
  assert.deepEqual(result.notebook.pages.map((p) => p.title), ['', 'İkinci'])
  assert.equal(storage.getItem(NOTEBOOK_KEY), old)
  assert.equal(storage.getItem(CORRUPT_KEY), null)
})

test('kota aşılınca kayıt "quota" hatası verir, eski kayıt yerinde kalır', () => {
  const storage = createMemoryStorage({ quota: 400 })
  saveNotebook(storage, notebook, 1)
  const before = storage.getItem(NOTEBOOK_KEY)
  const big = { ...notebook, pages: [{ id: 'x', title: 'x'.repeat(40), items: [], pad: 'y'.repeat(500) }] }
  const result = saveNotebook(storage, big, 2)
  assert.equal(result.ok, false)
  assert.equal(result.error, 'quota')
  assert.equal(storage.getItem(NOTEBOOK_KEY), before)
})

test('tercihler yazılır ve okunur, geçersiz tercih varsayılana döner', () => {
  const storage = createMemoryStorage()
  assert.deepEqual(loadPrefs(storage), { spreadIndex: 0, panelTab: 'stickers' })
  savePrefs(storage, { spreadIndex: 2, panelTab: 'decorations' })
  assert.deepEqual(loadPrefs(storage), { spreadIndex: 2, panelTab: 'decorations' })
  storage.setItem(PREFS_KEY, '{"spreadIndex":-1,"panelTab":"properties"}')
  assert.deepEqual(loadPrefs(storage), { spreadIndex: 0, panelTab: 'stickers' })
  storage.setItem(PREFS_KEY, 'bozuk')
  assert.deepEqual(loadPrefs(storage), { spreadIndex: 0, panelTab: 'stickers' })
})

test('doluluk yalnızca ad: anahtarlarını sayar, yedek anahtar dahil', () => {
  const storage = createMemoryStorage()
  storage.setItem('baska', 'x'.repeat(1000))
  storage.setItem(NOTEBOOK_KEY, 'abc')
  storage.setItem(CORRUPT_KEY, 'de')
  assert.equal(getUsage(storage), NOTEBOOK_KEY.length + 3 + CORRUPT_KEY.length + 2)
  assert.equal(usageRatio(2_500_000), 0.5)
})

test('wouldExceed eklenecek veriyle sınırı kontrol eder', () => {
  const storage = createMemoryStorage()
  assert.equal(wouldExceed(storage, 4_000_000, 0.9), false)
  assert.equal(wouldExceed(storage, 4_600_000, 0.9), true)
})

test('isNotebookKey yalnızca defter anahtarını ve temizlemeyi tanır', () => {
  assert.equal(isNotebookKey(NOTEBOOK_KEY), true)
  assert.equal(isNotebookKey(null), true)
  assert.equal(isNotebookKey(PREFS_KEY), false)
})

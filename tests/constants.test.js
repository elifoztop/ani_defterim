import { test } from 'node:test'
import assert from 'node:assert/strict'
import * as c from '../src/state/constants.js'

test('sayfa boyutu 800 × 1000 birim', () => {
  assert.equal(c.PAGE_W, 800)
  assert.equal(c.PAGE_H, 1000)
})

test('sınırlar SPEC ile uyumlu', () => {
  assert.equal(c.MAX_PAGES, 8)
  assert.equal(c.MAX_PHOTOS_PER_PAGE, 3)
  assert.equal(c.HISTORY_LIMIT, 30)
  assert.equal(c.MIN_ITEM, 40)
  assert.equal(c.STORAGE_CAPACITY, 5_000_000)
  assert.equal(c.SCHEMA_VERSION, 1)
})

test('bütün LocalStorage anahtarları ad: önekiyle başlar', () => {
  for (const key of [c.NOTEBOOK_KEY, c.CORRUPT_KEY, c.PREFS_KEY]) {
    assert.ok(key.startsWith(c.STORAGE_PREFIX), key)
  }
})

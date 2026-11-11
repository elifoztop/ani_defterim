import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createEmptyNotebook, createPage, displayTitle, normalizeNotebook } from '../src/state/model.js'

const text = (extra = {}) => ({ id: 'it_t', type: 'text', props: { content: 'Merhaba' }, ...extra })

test('boş defter iki başlıksız sayfayla başlar, ekranda Sayfa 1 ve Sayfa 2 görünür', () => {
  const nb = createEmptyNotebook()
  assert.equal(nb.schemaVersion, 1)
  assert.deepEqual(nb.pages.map((p) => p.title), ['', ''])
  assert.deepEqual(nb.pages.map(displayTitle), ['Sayfa 1', 'Sayfa 2'])
  assert.notEqual(nb.pages[0].id, nb.pages[1].id)
})

test('createPage başlığı boş bırakır, "Sayfa N" kayda yazılmaz', () => {
  assert.equal(createPage().title, '')
  assert.match(createPage().id, /^pg_/)
})

test('displayTitle boş başlıkta sırayı, dolu başlıkta başlığı gösterir', () => {
  assert.equal(displayTitle({ title: '' }, 4), 'Sayfa 5')
  assert.equal(displayTitle({ title: 'Tatil' }, 4), 'Tatil')
})

test('kayıt yalnızca okunamıyorsa bozuktur', () => {
  assert.equal(normalizeNotebook(null), null)
  assert.equal(normalizeNotebook('metin'), null)
  assert.equal(normalizeNotebook({ schemaVersion: 1 }), null)
  assert.equal(normalizeNotebook({ schemaVersion: 1, pages: 'x' }), null)
  assert.equal(normalizeNotebook({ pages: [] }), null)
  assert.equal(normalizeNotebook({ schemaVersion: 2, pages: [] }), null)
})

test('boş pages dizisine bir sayfa eklenir', () => {
  const { notebook } = normalizeNotebook({ schemaVersion: 1, pages: [] })
  assert.equal(notebook.pages.length, 1)
  assert.equal(notebook.pages[0].title, '')
})

test('eksik başlık ve items tamamlanır, fazladan alanlar korunur', () => {
  const { notebook } = normalizeNotebook({
    schemaVersion: 1,
    extra: 'kalır',
    pages: [{ id: 'pg_a', title: 'Tatil' }, { id: 'pg_b', title: 5, note: 'x' }],
  })
  assert.equal(notebook.extra, 'kalır')
  assert.equal(notebook.pages[0].title, 'Tatil')
  assert.deepEqual(notebook.pages[0].items, [])
  assert.equal(notebook.pages[1].title, '')
  assert.equal(notebook.pages[1].note, 'x')
})

test('geçiş: tam olarak "Sayfa N" biçimindeki eski başlıklar boşaltılır, diğerleri korunur', () => {
  const titles = ['Sayfa 8', ' Sayfa 12 ', 'Sayfa 2 tatil', 'sayfa 3', 'Sayfa3', 'Sayfa', 'Okul']
  const { notebook } = normalizeNotebook({
    schemaVersion: 1,
    pages: titles.map((title, i) => ({ id: `p${i}`, title })),
  })
  assert.deepEqual(notebook.pages.map((p) => p.title), ['', '', 'Sayfa 2 tatil', 'sayfa 3', 'Sayfa3', 'Sayfa', 'Okul'])
})

test('40 karakterden uzun başlık kesilir', () => {
  const { notebook } = normalizeNotebook({ schemaVersion: 1, pages: [{ id: 'p', title: 'a'.repeat(60) }] })
  assert.equal(notebook.pages[0].title.length, 40)
})

test('8 sayfadan fazlası silinmez', () => {
  const pages = Array.from({ length: 10 }, (_, i) => ({ id: `pg_${i}`, title: `S${i}` }))
  const { notebook } = normalizeNotebook({ schemaVersion: 1, pages })
  assert.equal(notebook.pages.length, 10)
})

test('tanınmayan nesne atlanır ve uyarı yazılır, geri kalanı açılır', () => {
  const { notebook, warnings } = normalizeNotebook({
    schemaVersion: 1,
    pages: [{ id: 'p', title: 'A', items: [{ id: 'x', type: 'video' }, text()] }],
  })
  assert.equal(notebook.pages[0].items.length, 1)
  assert.equal(warnings.length, 1)
})

test('eksik ya da tekrar eden id yenilenir', () => {
  const { notebook, warnings } = normalizeNotebook({
    schemaVersion: 1,
    pages: [{ id: 'dup', items: [text({ id: 'dup' }), text({ id: undefined })] }, { id: 'dup' }],
  })
  const ids = [notebook.pages[0].id, notebook.pages[1].id, ...notebook.pages[0].items.map((i) => i.id)]
  assert.equal(new Set(ids).size, 4)
  assert.equal(notebook.pages[0].id, 'dup')
  assert.equal(warnings.length, 3)
})

test('eksik sayısal alanlar ve yazı ayarları varsayılanla tamamlanır', () => {
  const { notebook } = normalizeNotebook({
    schemaVersion: 1,
    pages: [{ id: 'p', items: [text({ x: 'a', props: { content: 'Not', size: 200, font: 'comic' } })] }],
  })
  const item = notebook.pages[0].items[0]
  assert.equal(item.x, 400)
  assert.equal(item.rotation, 0)
  assert.deepEqual(item.props, {
    content: 'Not', font: 'hand', size: 72, bold: false, italic: false, align: 'left',
  })
})

test('fotoğraf notu yoksa boş metin olur', () => {
  const { notebook } = normalizeNotebook({
    schemaVersion: 1,
    pages: [{ id: 'p', items: [{ id: 'f', type: 'photo', props: { src: 'data:image/jpeg;base64,AA' } }] }],
  })
  assert.equal(notebook.pages[0].items[0].props.caption, '')
})

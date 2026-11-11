import { LIBRARY_TABS } from './constants.js'

// UI durumu: hangi açık defter, hangi sayfa aktif, ne seçili, panelde hangi sekme açık.
// Notebook ile birlikte değil, ayrı tutulur; geçmişe girmez (SPEC 7.4).

export const spreadCount = (notebook) => Math.ceil(notebook.pages.length / 2)
const clampSpread = (index, notebook) =>
  Math.min(Math.max(0, Math.trunc(Number(index) || 0)), spreadCount(notebook) - 1)
const pageIndex = (notebook, pageId) => notebook.pages.findIndex((p) => p.id === pageId)
const spreadOfPage = (notebook, pageId) => Math.floor(pageIndex(notebook, pageId) / 2)

function findItemPageId(notebook, itemId) {
  const page = notebook.pages.find((p) => p.items.some((item) => item.id === itemId))
  return page ? page.id : null
}

export function findItem(notebook, itemId) {
  for (const page of notebook.pages) {
    const item = page.items.find((i) => i.id === itemId)
    if (item) return { item, pageId: page.id }
  }
  return null
}

function clearSelection(ui) {
  const panelTab = ui.panelTab === 'properties' ? ui.lastLibraryTab : ui.panelTab
  return { ...ui, selectedItemId: null, editingItemId: null, panelTab }
}

function goToSpread(ui, notebook, spreadIndex) {
  const index = clampSpread(spreadIndex, notebook)
  return { ...clearSelection(ui), spreadIndex: index, activePageId: notebook.pages[index * 2].id }
}

export function createInitialUi(notebook, prefs = {}) {
  const tab = LIBRARY_TABS.includes(prefs.panelTab) ? prefs.panelTab : LIBRARY_TABS[0]
  const ui = {
    spreadIndex: 0,
    activePageId: null,
    selectedItemId: null,
    editingItemId: null,
    panelTab: tab,
    lastLibraryTab: tab,
  }
  return goToSpread(ui, notebook, prefs.spreadIndex)
}

function setPanelTab(ui, tab) {
  if (LIBRARY_TABS.includes(tab)) return { ...ui, panelTab: tab, lastLibraryTab: tab }
  if (tab === 'properties' && ui.selectedItemId) return { ...ui, panelTab: tab }
  return ui
}

// Yeni nesne seçilir. Yazı nesnesi düzenleme modunda açılır (SPEC 6.4).
function selectNewItem(ui, notebook, item) {
  const pageId = item && findItemPageId(notebook, item.id)
  if (!pageId) return ui
  const editingItemId = item.type === 'text' ? item.id : null
  return { ...ui, selectedItemId: item.id, editingItemId, activePageId: pageId, panelTab: 'properties' }
}

export function uiReducer(ui, action, notebook) {
  const payload = action.payload ?? {}
  switch (action.type) {
    case 'ui/setSpread':
      return goToSpread(ui, notebook, payload.spreadIndex)
    case 'ui/setActivePage':
      return pageIndex(notebook, payload.pageId) < 0 ? ui : { ...ui, activePageId: payload.pageId }
    case 'ui/select':
      return { ...ui, selectedItemId: payload.itemId, editingItemId: null, activePageId: payload.pageId, panelTab: 'properties' }
    case 'ui/deselect':
      return clearSelection(ui)
    case 'ui/startEdit':
      return { ...ui, selectedItemId: payload.itemId, editingItemId: payload.itemId }
    case 'ui/endEdit':
      return { ...ui, editingItemId: null }
    case 'ui/setPanelTab':
      return setPanelTab(ui, payload.tab)
    case 'item/add':
      return selectNewItem(ui, notebook, payload.item)
    case 'page/add':
      if (pageIndex(notebook, payload.page?.id) < 0) return ui
      return { ...goToSpread(ui, notebook, spreadOfPage(notebook, payload.page.id)), activePageId: payload.page.id }
    default:
      return ui
  }
}

// Var olmayan sayfa yoksa: önceki notebook'taki sırası, o sıra da yoksa son sayfa.
function resolvePageId(pageId, prev, next) {
  if (pageIndex(next, pageId) >= 0) return pageId
  const oldIndex = prev ? pageIndex(prev, pageId) : -1
  if (oldIndex >= 0 && oldIndex < next.pages.length) return next.pages[oldIndex].id
  return next.pages[next.pages.length - 1].id
}

function isOnSpread(notebook, spreadIndex, pageId) {
  const index = pageIndex(notebook, pageId)
  return index >= 0 && Math.floor(index / 2) === spreadIndex
}

export function sameUi(a, b) {
  return Object.keys(a).every((key) => a[key] === b[key])
}

// Her eylemden sonra çalışır (karar 46). Geçersiz referansları temizler.
// focusPageId yalnızca undo/redo sonrası gelir: uygulama o sayfanın açık defterine geçer.
export function reconcileUi(ui, { prev = null, next, focusPageId = null }) {
  let result = { ...ui }
  const selectedPageId = result.selectedItemId && findItemPageId(next, result.selectedItemId)
  if (result.selectedItemId && !selectedPageId) result = clearSelection(result)
  if (result.editingItemId && !findItemPageId(next, result.editingItemId)) result.editingItemId = null

  const needsMove = focusPageId || pageIndex(next, result.activePageId) < 0
  if (needsMove) {
    const target = resolvePageId(focusPageId || result.activePageId, prev, next)
    result.activePageId = target
    result.spreadIndex = spreadOfPage(next, target)
  }
  result.spreadIndex = clampSpread(result.spreadIndex, next)
  if (!isOnSpread(next, result.spreadIndex, result.activePageId)) {
    result.activePageId = next.pages[result.spreadIndex * 2].id
  }
  const itemPageId = result.selectedItemId && findItemPageId(next, result.selectedItemId)
  if (itemPageId && !isOnSpread(next, result.spreadIndex, itemPageId)) result = clearSelection(result)

  return sameUi(ui, result) ? ui : result
}

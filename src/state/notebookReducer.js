import { MAX_PAGES, TITLE_MAX } from './constants.js'
import { reduceItems } from './itemReducer.js'

// Bütün notebook değişiklikleri buradan geçer. Reducer saftır: id ve zaman üretmez (karar 40).
// Değişiklik yoksa aynı nesneyi döndürür; geçmiş bu durumda yeni adım açmaz.

function addPage(notebook, { page }) {
  if (notebook.pages.length >= MAX_PAGES) return notebook
  if (notebook.pages.some((p) => p.id === page.id)) return notebook
  return { ...notebook, pages: [...notebook.pages, page] }
}

function deletePage(notebook, { pageId }) {
  if (notebook.pages.length <= 1) return notebook
  const pages = notebook.pages.filter((p) => p.id !== pageId)
  if (pages.length === notebook.pages.length) return notebook
  return { ...notebook, pages }
}

function renamePage(notebook, { pageId, title }) {
  const index = notebook.pages.findIndex((p) => p.id === pageId)
  if (index < 0) return notebook
  const clean = String(title ?? '').trim().slice(0, TITLE_MAX)
  if (clean === notebook.pages[index].title) return notebook
  const pages = notebook.pages.map((p, i) => (i === index ? { ...p, title: clean } : p))
  return { ...notebook, pages }
}

export function notebookReducer(notebook, action) {
  switch (action.type) {
    case 'page/add':
      return addPage(notebook, action.payload)
    case 'page/delete':
      return deletePage(notebook, action.payload)
    case 'page/rename':
      return renamePage(notebook, action.payload)
    default:
      return action.type.startsWith('item/') ? reduceItems(notebook, action) : notebook
  }
}

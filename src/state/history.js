import { HISTORY_LIMIT } from './constants.js'

// Bu eylemler yeni geçmiş adımı açmaz: yalnızca present değişir (karar 45).
export const MERGE_ACTIONS = new Set(['item/measure'])

export function createHistory(present) {
  return { past: [], present, future: [], lastChangedPageId: null }
}

export const canUndo = (history) => history.past.length > 0
export const canRedo = (history) => history.future.length > 0

// İki notebook arasında farklı olan ilk sayfanın id'si. Sayfa yalnızca birinde olabilir.
export function findChangedPageId(before, after) {
  const beforeById = new Map(before.pages.map((p) => [p.id, p]))
  for (const page of after.pages) {
    if (beforeById.get(page.id) !== page) return page.id
  }
  const afterIds = new Set(after.pages.map((p) => p.id))
  const removed = before.pages.find((p) => !afterIds.has(p.id))
  return removed ? removed.id : null
}

function undo(history) {
  if (!canUndo(history)) return history
  const previous = history.past[history.past.length - 1]
  return {
    past: history.past.slice(0, -1),
    present: previous,
    future: [history.present, ...history.future],
    lastChangedPageId: findChangedPageId(history.present, previous),
  }
}

function redo(history) {
  if (!canRedo(history)) return history
  const [next, ...future] = history.future
  return {
    past: [...history.past, history.present],
    present: next,
    future,
    lastChangedPageId: findChangedPageId(history.present, next),
  }
}

export function historyReducer(reducer) {
  return function reduceHistory(history, action) {
    if (action.type === 'history/undo') return undo(history)
    if (action.type === 'history/redo') return redo(history)

    const present = reducer(history.present, action)
    if (present === history.present) return history
    if (MERGE_ACTIONS.has(action.type)) return { ...history, present }

    return {
      past: [...history.past, history.present].slice(-HISTORY_LIMIT),
      present,
      future: [],
      lastChangedPageId: null,
    }
  }
}

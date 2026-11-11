import { notebookReducer } from './notebookReducer.js'
import { createHistory, historyReducer } from './history.js'
import { createInitialUi, reconcileUi, uiReducer } from './uiReducer.js'

const reduceHistory = historyReducer(notebookReducer)
const HISTORY_PREFIXES = ['page/', 'item/', 'history/']
const isHistoryAction = (type) => HISTORY_PREFIXES.some((prefix) => type.startsWith(prefix))
const isUndoRedo = (type) => type === 'history/undo' || type === 'history/redo'

export function createInitialState(notebook, prefs) {
  return { history: createHistory(notebook), ui: createInitialUi(notebook, prefs) }
}

// Kök reducer (karar 46): önce geçmiş, sonra UI, en son referans temizliği.
export function appReducer(state, action) {
  const history = isHistoryAction(action.type)
    ? reduceHistory(state.history, action)
    : state.history
  const notebook = history.present
  const focusPageId =
    isUndoRedo(action.type) && history !== state.history ? history.lastChangedPageId : null

  const ui = reconcileUi(uiReducer(state.ui, action, notebook), {
    prev: state.history.present,
    next: notebook,
    focusPageId,
  })

  if (history === state.history && ui === state.ui) return state
  return { history, ui }
}

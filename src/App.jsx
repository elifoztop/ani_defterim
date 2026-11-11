import { useReducer, useState } from 'react'
import TopBar from './components/TopBar.jsx'
import Notebook from './components/Notebook.jsx'
import PageBar from './components/PageBar.jsx'
import Toolbar from './components/Toolbar.jsx'
import SidePanel from './components/panel/SidePanel.jsx'
import NarrowScreenNotice from './components/NarrowScreenNotice.jsx'
import StaleTabNotice from './components/StaleTabNotice.jsx'
import Toast from './components/Toast.jsx'
import ConfirmDialog from './components/ConfirmDialog.jsx'
import { appReducer, createInitialState } from './state/appReducer.js'
import { canRedo, canUndo } from './state/history.js'
import { createPage, displayTitle } from './state/model.js'
import { spreadCount } from './state/uiReducer.js'
import { MAX_PAGES } from './state/constants.js'
import { usageRatio } from './state/storage.js'
import { useAutosave } from './hooks/useAutosave.js'
import { useCrossTabGuard } from './hooks/useCrossTabGuard.js'
import { usePrefs } from './hooks/usePrefs.js'
import { MESSAGES, deletePageQuestion } from './lib/messages.js'
import './styles/layout.css'

const initState = (boot) => createInitialState(boot.notebook, boot.prefs)

export default function App({ boot }) {
  const [state, dispatch] = useReducer(appReducer, boot, initState)
  const [toast, setToast] = useState(boot.notice ? MESSAGES[boot.notice] : null)
  const [pendingDelete, setPendingDelete] = useState(null)
  const stale = useCrossTabGuard()
  const paused = stale || !boot.persistent

  const notebook = state.history.present
  const { ui } = state
  const { pages } = notebook
  const showSaveError = (code) => setToast(code === 'quota' ? MESSAGES.saveQuota : MESSAGES.saveUnknown)
  const { status, usage } = useAutosave(notebook, boot.storage, paused, showSaveError)
  usePrefs(ui, boot.storage, paused)

  const send = (type, payload) => dispatch({ type, payload })
  const canAdd = pages.length < MAX_PAGES
  const canDelete = pages.length > 1
  const addPage = () => canAdd && send('page/add', { page: createPage() })
  const goToSpread = (spreadIndex) => send('ui/setSpread', { spreadIndex })
  const askDelete = () => {
    const index = pages.findIndex((p) => p.id === ui.activePageId)
    if (index >= 0 && canDelete) setPendingDelete({ id: pages[index].id, title: displayTitle(pages[index], index) })
  }
  const confirmDelete = () => {
    send('page/delete', { pageId: pendingDelete.id })
    setPendingDelete(null)
  }

  const left = pages[ui.spreadIndex * 2]
  const right = pages[ui.spreadIndex * 2 + 1] ?? null

  return (
    <>
      <NarrowScreenNotice />
      <div className="app-shell">
        <TopBar
          status={status}
          canUndo={canUndo(state.history)}
          canRedo={canRedo(state.history)}
          onUndo={() => send('history/undo')}
          onRedo={() => send('history/redo')}
        />
        <main className="workspace">
          {stale && <StaleTabNotice />}
          <Notebook
            leftPage={left}
            leftIndex={ui.spreadIndex * 2}
            rightPage={right}
            activePageId={ui.activePageId}
            canAdd={canAdd}
            onAddPage={addPage}
            onActivate={(pageId) => send('ui/setActivePage', { pageId })}
            onRename={(pageId, title) => send('page/rename', { pageId, title })}
          />
          <PageBar
            spreadIndex={ui.spreadIndex}
            pageCount={pages.length}
            spreadTotal={spreadCount(notebook)}
            canAdd={canAdd}
            canDelete={canDelete}
            onGo={goToSpread}
            onAdd={addPage}
            onDelete={askDelete}
          />
          <Toolbar />
        </main>
        <SidePanel
          panelTab={ui.panelTab}
          hasSelection={Boolean(ui.selectedItemId)}
          onTab={(tab) => send('ui/setPanelTab', { tab })}
          usageRatio={usageRatio(usage)}
        />
      </div>
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
      {pendingDelete && (
        <ConfirmDialog
          message={deletePageQuestion(pendingDelete.title)}
          confirmLabel="Sayfayı sil"
          onConfirm={confirmDelete}
          onCancel={() => setPendingDelete(null)}
        />
      )}
    </>
  )
}

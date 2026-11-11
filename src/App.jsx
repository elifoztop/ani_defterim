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
import { displayTitle } from './state/model.js'
import { addLibraryItemAction, addPageAction, addPhotoAction, addTextAction } from './state/actions.js'
import { findItem, spreadCount } from './state/uiReducer.js'
import { MAX_PAGES } from './state/constants.js'
import { usageRatio } from './state/storage.js'
import { useAutosave } from './hooks/useAutosave.js'
import { useCrossTabGuard } from './hooks/useCrossTabGuard.js'
import { usePrefs } from './hooks/usePrefs.js'
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts.js'
import { usePhotoUpload } from './hooks/usePhotoUpload.js'
import { canAddPhoto } from './lib/photoRules.js'
import { createEditor } from './lib/editor.js'
import { MESSAGES, deletePageQuestion } from './lib/messages.js'
import './styles/layout.css'

const initState = (boot) => createInitialState(boot.notebook, boot.prefs)

export default function App({ boot }) {
  const [state, dispatch] = useReducer(appReducer, boot, initState)
  const [toast, setToast] = useState(boot.notice ? MESSAGES[boot.notice] : null)
  const [pendingDelete, setPendingDelete] = useState(null)
  const [rotationPreview, setRotationPreview] = useState(null)
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
  const addPage = () => canAdd && dispatch(addPageAction())
  const undo = () => send('history/undo')
  const redo = () => send('history/redo')
  const goToSpread = (spreadIndex) => send('ui/setSpread', { spreadIndex })
  const askDelete = () => {
    const index = pages.findIndex((p) => p.id === ui.activePageId)
    if (index >= 0 && canDelete) setPendingDelete({ id: pages[index].id, title: displayTitle(pages[index], index) })
  }
  const confirmDelete = () => {
    send('page/delete', { pageId: pendingDelete.id })
    setPendingDelete(null)
  }

  const editor = createEditor(send, ui, rotationPreview, setRotationPreview, setToast)
  const selected = ui.selectedItemId ? findItem(notebook, ui.selectedItemId) : null
  const deleteSelected = () => selected && editor.deleteItem(selected.pageId, selected.item.id)
  const setPanelTab = (tab) => send('ui/setPanelTab', { tab })
  const photos = usePhotoUpload({
    storage: boot.storage,
    onAdd: (pageId, photo) => dispatch(addPhotoAction(pageId, photo)),
    onError: setToast,
  })
  const activePage = pages.find((p) => p.id === ui.activePageId)
  useKeyboardShortcuts({
    enabled: !pendingDelete,
    onDelete: deleteSelected,
    onUndo: undo,
    onRedo: redo,
    onEscape: editor.deselect,
  })

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
          onUndo={undo}
          onRedo={redo}
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
            editor={editor}
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
          <Toolbar
            hasSelection={Boolean(selected)}
            photo={{
              canAdd: canAddPhoto(activePage),
              loading: photos.loading,
              onFile: (file) => photos.upload(file, ui.activePageId),
            }}
            onTab={setPanelTab}
            onAddText={() => dispatch(addTextAction(ui.activePageId))}
            onDeleteSelected={deleteSelected}
          />
        </main>
        <SidePanel
          panelTab={ui.panelTab}
          selected={selected}
          editor={editor}
          onTab={setPanelTab}
          onAddLibraryItem={(entry) => dispatch(addLibraryItemAction(ui.activePageId, entry))}
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

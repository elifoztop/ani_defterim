import TopBar from './components/TopBar.jsx'
import Notebook from './components/Notebook.jsx'
import PageBar from './components/PageBar.jsx'
import Toolbar from './components/Toolbar.jsx'
import SidePanel from './components/panel/SidePanel.jsx'
import NarrowScreenNotice from './components/NarrowScreenNotice.jsx'
import { PREVIEW_PAGES } from './state/previewData.js'
import './styles/layout.css'

export default function App() {
  const [leftPage, rightPage] = PREVIEW_PAGES

  return (
    <>
      <NarrowScreenNotice />
      <div className="app-shell">
        <TopBar />
        <main className="workspace">
          <Notebook leftPage={leftPage} rightPage={rightPage} activePageId={leftPage.id} />
          <PageBar spreadIndex={0} pageCount={PREVIEW_PAGES.length} />
          <Toolbar />
        </main>
        <SidePanel />
      </div>
    </>
  )
}

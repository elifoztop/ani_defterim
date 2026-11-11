import { MESSAGES } from '../lib/messages.js'
import '../styles/Notices.css'

export default function StaleTabNotice() {
  return (
    <div className="stale-notice" role="alert">
      <p>{MESSAGES.staleTab}</p>
      <button type="button" className="btn" onClick={() => window.location.reload()}>
        Yenile
      </button>
    </div>
  )
}

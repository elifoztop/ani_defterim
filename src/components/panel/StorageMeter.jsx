import { STORAGE_WARN_RATIO } from '../../state/constants.js'
import { MESSAGES } from '../../lib/messages.js'
import '../../styles/StorageMeter.css'

export default function StorageMeter({ ratio }) {
  const percent = Math.min(100, Math.round(ratio * 100))
  const warn = ratio > STORAGE_WARN_RATIO
  const label = ratio > 0 && ratio < 0.01 ? "%1'den az" : `%${percent}`
  return (
    <div className={`storage-meter${warn ? ' storage-meter--warn' : ''}`}>
      <div className="storage-meter__row">
        <span>Depolama</span>
        <span>{label}</span>
      </div>
      <div
        className="storage-meter__track"
        role="meter"
        aria-label="Depolama doluluğu"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        aria-valuetext={label}
      >
        <div className="storage-meter__fill" style={{ width: `${percent}%` }} />
      </div>
      {warn && <p className="storage-meter__warning">{MESSAGES.storageWarn}</p>}
    </div>
  )
}

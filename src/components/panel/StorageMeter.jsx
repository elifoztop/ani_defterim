import '../../styles/StorageMeter.css'

export default function StorageMeter({ percent }) {
  const warn = percent > 80
  return (
    <div className={`storage-meter${warn ? ' storage-meter--warn' : ''}`}>
      <div className="storage-meter__row">
        <span>Depolama</span>
        <span>%{percent}</span>
      </div>
      <div
        className="storage-meter__track"
        role="meter"
        aria-label="Depolama doluluğu"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
      >
        <div className="storage-meter__fill" style={{ width: `${percent}%` }} />
      </div>
    </div>
  )
}

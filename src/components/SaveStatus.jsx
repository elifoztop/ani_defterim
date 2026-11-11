import '../styles/SaveStatus.css'

const LABELS = {
  saved: 'Kaydedildi',
  dirty: 'Kaydedilmemiş değişiklik',
  saving: 'Kaydediliyor…',
  failed: 'Kaydedilemedi',
  paused: 'Kayıt durduruldu',
}

export default function SaveStatus({ status }) {
  return (
    <div className={`save-status save-status--${status}`} role="status">
      <span className="save-status__dot" aria-hidden="true" />
      {LABELS[status]}
    </div>
  )
}

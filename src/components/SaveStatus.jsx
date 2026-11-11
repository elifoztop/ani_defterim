import '../styles/SaveStatus.css'

export default function SaveStatus({ label }) {
  return (
    <div className="save-status" role="status">
      <span className="save-status__dot" aria-hidden="true" />
      {label}
    </div>
  )
}

import '../styles/Notices.css'

export default function Toast({ message, onClose }) {
  return (
    <div className="toast glass" role="alert">
      <p>{message}</p>
      <button type="button" className="btn" onClick={onClose}>
        Kapat
      </button>
    </div>
  )
}

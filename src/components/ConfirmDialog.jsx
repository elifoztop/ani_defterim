import { useEffect, useRef } from 'react'
import '../styles/Notices.css'

// Yerleşik <dialog>: odak pencerede kalır, Esc vazgeçer.
export default function ConfirmDialog({ message, confirmLabel, onConfirm, onCancel }) {
  const ref = useRef(null)

  useEffect(() => {
    const dialog = ref.current
    if (dialog && !dialog.open) dialog.showModal()
  }, [])

  const onClose = () => onCancel()

  return (
    <dialog ref={ref} className="confirm-dialog glass" aria-labelledby="confirm-dialog-text" onClose={onClose}>
      <p id="confirm-dialog-text">{message}</p>
      <div className="confirm-dialog__actions">
        <button type="button" className="btn" autoFocus onClick={onCancel}>
          Vazgeç
        </button>
        <button type="button" className="btn btn--danger" onClick={onConfirm}>
          {confirmLabel}
        </button>
      </div>
    </dialog>
  )
}

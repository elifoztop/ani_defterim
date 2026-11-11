import { useEffect, useEffectEvent, useState } from 'react'
import { AUTOSAVE_DELAY } from '../state/constants.js'
import { getUsage, saveNotebook } from '../state/storage.js'

const SAVING_VISIBLE_MS = 400

// Notebook değişince 600 ms bekler ve kaydeder. Bekleyen kaydı pagehide anında hemen yazar.
// paused iken hiçbir şey yazmaz (başka sekme uyarısı, karar 48).
export function useAutosave(notebook, storage, paused, onError) {
  const [savedNotebook, setSavedNotebook] = useState(notebook)
  const [failed, setFailed] = useState(false)
  const [saving, setSaving] = useState(false)
  const [usage, setUsage] = useState(() => getUsage(storage))

  const write = useEffectEvent(() => {
    if (paused || notebook === savedNotebook) return
    setSaving(true)
    setTimeout(() => setSaving(false), SAVING_VISIBLE_MS)
    const result = saveNotebook(storage, notebook)
    setUsage(getUsage(storage))
    if (result.ok) {
      setSavedNotebook(notebook)
      setFailed(false)
      return
    }
    console.error('Kayıt yazılamadı:', result.detail)
    setFailed(true)
    onError(result.error)
  })

  useEffect(() => {
    if (paused || notebook === savedNotebook) return undefined
    const timer = setTimeout(() => write(), AUTOSAVE_DELAY)
    return () => clearTimeout(timer)
  }, [notebook, savedNotebook, paused])

  useEffect(() => {
    const flush = () => write()
    window.addEventListener('pagehide', flush)
    return () => window.removeEventListener('pagehide', flush)
  }, [])

  let status = 'dirty'
  if (paused) status = 'paused'
  else if (saving) status = 'saving'
  else if (notebook === savedNotebook) status = 'saved'
  else if (failed) status = 'failed'

  return { status, usage }
}

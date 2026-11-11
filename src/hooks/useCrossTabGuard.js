import { useEffect, useState } from 'react'
import { isNotebookKey } from '../state/storage.js'

// Defter başka bir sekmede kaydedilirse true olur. storage olayı yalnızca başka sekmeler yazınca gelir.
export function useCrossTabGuard() {
  const [stale, setStale] = useState(false)

  useEffect(() => {
    const onStorage = (event) => {
      if (isNotebookKey(event.key)) setStale(true)
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  return stale
}

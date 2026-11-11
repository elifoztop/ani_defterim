import { useEffect } from 'react'
import { savePrefs } from '../state/storage.js'

// Açık defteri ve son kütüphane sekmesini ad:prefs anahtarına yazar.
export function usePrefs(ui, storage, paused) {
  const { spreadIndex, lastLibraryTab } = ui

  useEffect(() => {
    if (paused) return
    if (!savePrefs(storage, { spreadIndex, panelTab: lastLibraryTab })) {
      console.warn('Tercihler kaydedilemedi.')
    }
  }, [storage, spreadIndex, lastLibraryTab, paused])
}

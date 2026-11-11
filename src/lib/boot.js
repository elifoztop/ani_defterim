import { PREFS_KEY } from '../state/constants.js'
import { createMemoryStorage, loadNotebook, loadPrefs } from '../state/storage.js'

function getLocalStorage() {
  try {
    const storage = window.localStorage
    storage.getItem(PREFS_KEY)
    return storage
  } catch (error) {
    console.error('LocalStorage kullanılamıyor:', error)
    return null
  }
}

// Kayıt bir kez, React render etmeden önce okunur. StrictMode başlatıcıyı iki kez çalıştırır;
// bozuk kaydın yedeğe taşınması iki kez olmamalı.
export function bootApp() {
  const localStorage = getLocalStorage()
  const storage = localStorage ?? createMemoryStorage()
  const { notebook, status, warnings } = loadNotebook(storage)
  if (warnings.length > 0) console.warn('Kayıt açılırken düzeltmeler yapıldı:', warnings)
  if (status === 'corrupt') console.error('Kayıt okunamadı ve ad:notebook:corrupt anahtarına taşındı.')

  let notice = null
  if (!localStorage) notice = 'unavailable'
  else if (status === 'corrupt') notice = 'corrupt'

  return { storage, persistent: Boolean(localStorage), notebook, prefs: loadPrefs(storage), notice }
}

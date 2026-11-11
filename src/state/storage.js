import {
  CORRUPT_KEY,
  LIBRARY_TABS,
  NOTEBOOK_KEY,
  PREFS_KEY,
  STORAGE_CAPACITY,
  STORAGE_PREFIX,
} from './constants.js'
import { createEmptyNotebook, normalizeNotebook } from './model.js'

// Bütün fonksiyonlar depoyu parametre olarak alır (localStorage ya da testteki sahte depo).

export function isQuotaError(error) {
  return (
    error?.name === 'QuotaExceededError' ||
    error?.name === 'NS_ERROR_DOM_QUOTA_REACHED' ||
    error?.code === 22 ||
    error?.code === 1014
  )
}

// localStorage ile aynı arayüze sahip bellek deposu. quota verilirse aşımda hata fırlatır.
export function createMemoryStorage({ quota = Infinity } = {}) {
  const data = new Map()
  const size = () => [...data].reduce((sum, [k, v]) => sum + k.length + v.length, 0)
  return {
    get length() {
      return data.size
    },
    key: (index) => [...data.keys()][index] ?? null,
    getItem: (key) => (data.has(key) ? data.get(key) : null),
    setItem(key, value) {
      const text = String(value)
      const old = data.has(key) ? key.length + data.get(key).length : 0
      if (size() - old + key.length + text.length > quota) {
        const error = new Error('Depolama kotası aşıldı')
        error.name = 'QuotaExceededError'
        throw error
      }
      data.set(key, text)
    },
    removeItem: (key) => data.delete(key),
    clear: () => data.clear(),
  }
}

function parseJson(text) {
  try {
    return JSON.parse(text)
  } catch {
    return null
  }
}

function moveToCorrupt(storage, raw) {
  try {
    storage.removeItem(CORRUPT_KEY)
    storage.setItem(CORRUPT_KEY, raw)
    storage.removeItem(NOTEBOOK_KEY)
    return null
  } catch (error) {
    return error
  }
}

// status: "ok" | "empty" | "corrupt". Bozuk kayıt tek bir yedek anahtara taşınır (karar 30).
export function loadNotebook(storage) {
  const raw = storage.getItem(NOTEBOOK_KEY)
  if (raw === null) return { notebook: createEmptyNotebook(), status: 'empty', warnings: [] }

  const result = normalizeNotebook(parseJson(raw))
  if (result) return { notebook: result.notebook, status: 'ok', warnings: result.warnings }

  const backupError = moveToCorrupt(storage, raw)
  const warnings = backupError ? [`Bozuk kayıt yedeklenemedi: ${backupError.message}`] : []
  return { notebook: createEmptyNotebook(), status: 'corrupt', warnings }
}

export function saveNotebook(storage, notebook, now = Date.now()) {
  try {
    storage.setItem(NOTEBOOK_KEY, JSON.stringify({ ...notebook, updatedAt: now }))
    return { ok: true }
  } catch (error) {
    return { ok: false, error: isQuotaError(error) ? 'quota' : 'unknown', detail: error }
  }
}

export function loadPrefs(storage) {
  const raw = parseJson(storage.getItem(PREFS_KEY))
  const spreadIndex = Number.isInteger(raw?.spreadIndex) && raw.spreadIndex >= 0 ? raw.spreadIndex : 0
  const panelTab = LIBRARY_TABS.includes(raw?.panelTab) ? raw.panelTab : LIBRARY_TABS[0]
  return { spreadIndex, panelTab }
}

export function savePrefs(storage, { spreadIndex, panelTab }) {
  try {
    storage.setItem(PREFS_KEY, JSON.stringify({ spreadIndex, panelTab }))
    return true
  } catch {
    return false
  }
}

export const isNotebookKey = (key) => key === NOTEBOOK_KEY || key === null

// "ad:" ile başlayan bütün anahtarların (ad + değer) uzunluğu (karar 34).
export function getUsage(storage) {
  let used = 0
  for (let i = 0; i < storage.length; i += 1) {
    const key = storage.key(i)
    if (key?.startsWith(STORAGE_PREFIX)) used += key.length + (storage.getItem(key) ?? '').length
  }
  return used
}

export const usageRatio = (used) => used / STORAGE_CAPACITY

export function wouldExceed(storage, extraChars, limitRatio) {
  return usageRatio(getUsage(storage) + extraChars) > limitRatio
}

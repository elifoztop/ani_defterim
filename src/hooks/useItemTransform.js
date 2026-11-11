import { useRef, useState } from 'react'
import {
  angleFromCenter,
  clampItemToPage,
  resizeKeepRatio,
  resizeWidthOnly,
  screenToPage,
  snapAngle,
} from '../lib/geometry.js'

function nextGeometry({ mode, start, item, bounds }, point, shiftKey) {
  if (mode === 'rotate') {
    const angle = angleFromCenter(item.x, item.y, point.x, point.y)
    return clampItemToPage({ ...item, rotation: shiftKey ? snapAngle(angle) : Math.round(angle) })
  }
  if (mode === 'resize') {
    const resized = item.type === 'text' ? resizeWidthOnly(item, point) : resizeKeepRatio(item, point)
    return clampItemToPage(resized)
  }
  // Taşırken nesne karşı sayfaya da gidebilir (bounds); bırakınca tek sayfaya yerleşir.
  return clampItemToPage({ ...item, x: item.x + point.x - start.x, y: item.y + point.y - start.y }, bounds)
}

// Taşıma, boyutlandırma ve döndürme. Ara konumlar yerel durumda tutulur;
// reducer'a yalnızca pointerup anında tek eylem gider (CLAUDE.md, SPEC 7.1).
export function useItemTransform(item, { disabled, bounds, onStart, onCommit }) {
  const [draft, setDraft] = useState(null)
  const sessionRef = useRef(null)

  const onPointerDown = (event) => {
    if (event.button !== 0) return
    event.stopPropagation()
    onStart()
    if (disabled) return
    const handle = event.target.closest('[data-handle]')?.dataset.handle
    const rect = event.currentTarget.closest('.page').getBoundingClientRect()
    const start = screenToPage(event.clientX, event.clientY, rect)
    sessionRef.current = { mode: handle ?? 'move', rect, start, item, bounds, draft: null }
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const onPointerMove = (event) => {
    const session = sessionRef.current
    if (!session) return
    const point = screenToPage(event.clientX, event.clientY, session.rect)
    session.draft = nextGeometry(session, point, event.shiftKey)
    setDraft(session.draft)
  }

  const onPointerUp = () => {
    const session = sessionRef.current
    sessionRef.current = null
    if (session?.draft) onCommit(session.draft)
    setDraft(null)
  }

  const onPointerCancel = () => {
    sessionRef.current = null
    setDraft(null)
  }

  return { draft, handlers: { onPointerDown, onPointerMove, onPointerUp, onPointerCancel } }
}

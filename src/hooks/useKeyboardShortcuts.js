import { useEffect, useEffectEvent } from 'react'

function isTyping(target) {
  if (!(target instanceof HTMLElement)) return false
  return target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)
}

// SPEC 7.3. Kullanıcı bir yazı alanına yazarken kısayollar çalışmaz.
export function useKeyboardShortcuts({ enabled, onDelete, onUndo, onRedo, onEscape }) {
  const onKeyDown = useEffectEvent((event) => {
    if (!enabled || isTyping(event.target)) return
    const key = event.key.toLowerCase()
    const mod = event.ctrlKey || event.metaKey
    let action = null
    if (key === 'delete' || key === 'backspace') action = onDelete
    else if (key === 'escape') action = onEscape
    else if (mod && key === 'z') action = event.shiftKey ? onRedo : onUndo
    else if (mod && key === 'y') action = onRedo
    if (!action) return
    event.preventDefault()
    action()
  })

  useEffect(() => {
    const listener = (event) => onKeyDown(event)
    window.addEventListener('keydown', listener)
    return () => window.removeEventListener('keydown', listener)
  }, [])
}

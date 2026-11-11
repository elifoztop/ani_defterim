// Yazı nesnesinin görünümü. Caveat'ın italik dosyası yok: italic değeri kayıtta kalır
// ama El yazısı fontunda uygulanmaz (karar 49).

export const FONT_OPTIONS = [
  { id: 'hand', label: 'El yazısı', family: 'var(--font-hand)' },
  { id: 'serif', label: 'Serif', family: 'var(--font-serif)' },
  { id: 'typewriter', label: 'Daktilo', family: 'var(--font-type)' },
]

export const ALIGN_OPTIONS = [
  { id: 'left', label: 'Sola hizala' },
  { id: 'center', label: 'Ortala' },
  { id: 'right', label: 'Sağa hizala' },
]

export const TEXT_SIZE_MIN = 14
export const TEXT_SIZE_MAX = 72

export const canItalic = (font) => font !== 'hand'

export function clampTextSize(size) {
  const value = Math.round(Number(size))
  if (!Number.isFinite(value)) return null
  return Math.min(TEXT_SIZE_MAX, Math.max(TEXT_SIZE_MIN, value))
}

export function resolveTextStyle(props) {
  const font = FONT_OPTIONS.find((option) => option.id === props.font) ?? FONT_OPTIONS[0]
  return {
    fontFamily: font.family,
    fontSize: props.size,
    fontWeight: props.bold ? 700 : 400,
    fontStyle: props.italic && canItalic(font.id) ? 'italic' : 'normal',
    fontSynthesisStyle: font.id === 'hand' ? 'none' : 'auto',
    textAlign: props.align,
  }
}

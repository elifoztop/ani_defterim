import { MIN_ITEM, PAGE_H, PAGE_W } from '../state/constants.js'

// Saf geometri. Açılar derecedir; CSS rotate() gibi saat yönünde pozitiftir (y aşağı doğru).

const toRad = (deg) => (deg * Math.PI) / 180
const clamp = (value, min, max) => Math.min(Math.max(value, min), max)

export function normalizeAngle(angle) {
  const a = ((((angle + 180) % 360) + 360) % 360) - 180
  return a === -180 ? 180 : a
}

export function snapAngle(angle, step = 15) {
  return normalizeAngle(Math.round(angle / step) * step)
}

// Döndürülmüş kutunun kapladığı dikdörtgenin yarı genişliği ve yarı yüksekliği.
export function rotatedHalfExtents(w, h, rotation) {
  const cos = Math.abs(Math.cos(toRad(rotation)))
  const sin = Math.abs(Math.sin(toRad(rotation)))
  return { hx: (w * cos + h * sin) / 2, hy: (w * sin + h * cos) / 2 }
}

// En küçük 40 birim. Döndürülmüş kutu sayfaya sığmıyorsa oran korunarak küçültülür.
// keepHeight: yazı nesnesinde yükseklik ölçülür, yalnızca genişlik değişir.
export function clampSize({ w, h, rotation }, keepHeight = false) {
  let width = clamp(w, MIN_ITEM, PAGE_W)
  let height = keepHeight ? h : clamp(h, MIN_ITEM, PAGE_H)
  const { hx, hy } = rotatedHalfExtents(width, height, rotation)
  const scale = Math.min(1, PAGE_W / (2 * hx), PAGE_H / (2 * hy))
  if (scale < 1) {
    width = Math.max(MIN_ITEM, width * scale)
    if (!keepHeight) height = Math.max(MIN_ITEM, height * scale)
  }
  return { w: width, h: height }
}

const clampAxis = (value, half, min, max) =>
  half * 2 >= max - min ? (min + max) / 2 : clamp(value, min + half, max - half)

// Nesneyi sayfanın içine iter. Kenara sürüklenen nesne kenarda durur.
// minX/maxX yalnızca sürükleme sırasında iki sayfalık alan için değişir (dragBoundsX).
export function clampItemToPage(item, { minX = 0, maxX = PAGE_W } = {}) {
  const rotation = normalizeAngle(item.rotation)
  const { w, h } = clampSize({ ...item, rotation }, item.type === 'text')
  const { hx, hy } = rotatedHalfExtents(w, h, rotation)
  return { ...item, w, h, rotation, x: clampAxis(item.x, hx, minX, maxX), y: clampAxis(item.y, hy, 0, PAGE_H) }
}

// Sürüklerken yatay alan (kendi sayfasının koordinatıyla). Karşı sayfa varsa onun alanı da eklenir.
export function dragBoundsX(side, hasOpposite) {
  if (!hasOpposite) return { minX: 0, maxX: PAGE_W }
  return side === 'left' ? { minX: 0, maxX: 2 * PAGE_W } : { minX: -PAGE_W, maxX: PAGE_W }
}

// Bırakınca nesne merkezinin düştüğü sayfaya ait olur. Bir nesne iki sayfaya birden ait olmaz;
// sonra o sayfanın içine itilir (karar 100).
export function dropTarget(x, side) {
  if (side === 'left' && x > PAGE_W) return { crossed: true, x: x - PAGE_W }
  if (side === 'right' && x < 0) return { crossed: true, x: x + PAGE_W }
  return { crossed: false, x }
}

// Ekrandaki fare konumunu sayfa birimine çevirir. rect: sayfa öğesinin getBoundingClientRect() sonucu.
export function screenToPage(clientX, clientY, rect) {
  return {
    x: ((clientX - rect.left) / rect.width) * PAGE_W,
    y: ((clientY - rect.top) / rect.height) * PAGE_H,
  }
}

// Merkezden bakınca noktanın açısı. Tam yukarısı 0°, sağ 90°.
export function angleFromCenter(cx, cy, px, py) {
  return normalizeAngle((Math.atan2(px - cx, cy - py) * 180) / Math.PI)
}

function rotate(x, y, deg) {
  const c = Math.cos(toRad(deg))
  const s = Math.sin(toRad(deg))
  return { x: x * c - y * s, y: x * s + y * c }
}

// Sol üst köşe sabit kalır; tutamaç sağ alt köşededir.
function resizeFromCorner(item, point, sizeFor) {
  const corner = rotate(-item.w / 2, -item.h / 2, item.rotation)
  const anchor = { x: item.x + corner.x, y: item.y + corner.y }
  const local = rotate(point.x - anchor.x, point.y - anchor.y, -item.rotation)
  const { w, h } = sizeFor(local)
  const offset = rotate(w / 2, h / 2, item.rotation)
  return { ...item, w, h, x: anchor.x + offset.x, y: anchor.y + offset.y }
}

export function resizeKeepRatio(item, point) {
  return resizeFromCorner(item, point, (local) => {
    const projected = (local.x * item.w + local.y * item.h) / (item.w ** 2 + item.h ** 2)
    const scale = Math.max(projected, MIN_ITEM / Math.min(item.w, item.h))
    return { w: item.w * scale, h: item.h * scale }
  })
}

export function resizeWidthOnly(item, point) {
  return resizeFromCorner(item, point, (local) => ({ w: Math.max(MIN_ITEM, local.x), h: item.h }))
}

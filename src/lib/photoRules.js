import { MAX_PHOTOS_PER_PAGE } from '../state/constants.js'

// Fotoğraf kuralları (SPEC 5). Saf JS; tarayıcı olmadan test edilir.

export const PHOTO_TYPES = ['image/png', 'image/jpeg', 'image/webp']
export const PHOTO_ACCEPT = PHOTO_TYPES.join(',')
export const MAX_PHOTO_BYTES = 15 * 1024 * 1024
export const PHOTO_LONG_EDGE = 600
export const PHOTO_QUALITY = 0.75
export const PHOTO_RETRY_QUALITY = 0.6
export const PHOTO_MAX_OUTPUT_BYTES = 80 * 1024

// Hata kodu ya da null. Tür MIME türünden kontrol edilir.
export function checkPhotoFile({ type, size }) {
  if (!PHOTO_TYPES.includes(type)) return 'type'
  if (size > MAX_PHOTO_BYTES) return 'size'
  return null
}

export const countPhotos = (page) => page.items.filter((item) => item.type === 'photo').length
export const canAddPhoto = (page) => Boolean(page) && countPhotos(page) < MAX_PHOTOS_PER_PAGE

// Küçültülmüş boyut: uzun kenar en fazla 600 piksel, küçük görsel büyütülmez.
export function scaledSize(width, height, longEdge = PHOTO_LONG_EDGE) {
  const scale = Math.min(1, longEdge / Math.max(width, height))
  return { width: Math.max(1, Math.round(width * scale)), height: Math.max(1, Math.round(height * scale)) }
}

// Base64 data URL'nin bayt cinsinden yaklaşık boyutu.
export function dataUrlBytes(dataUrl) {
  const base64 = dataUrl.slice(dataUrl.indexOf(',') + 1)
  return Math.floor((base64.length * 3) / 4)
}

// Polaroid çerçeve: yanlarda ve üstte genişliğin %6'sı, altta %22'si (SPEC 5).
export const POLAROID = { side: 0.06, top: 0.06, bottom: 0.22 }

export function polaroidSize(width, height) {
  const w = width >= height ? 280 : 220
  const imageWidth = w * (1 - 2 * POLAROID.side)
  const h = w * (POLAROID.top + POLAROID.bottom) + imageWidth * (height / width)
  return { w, h: Math.round(h * 10) / 10 }
}

import {
  PHOTO_MAX_OUTPUT_BYTES,
  PHOTO_QUALITY,
  PHOTO_RETRY_QUALITY,
  dataUrlBytes,
  scaledSize,
} from './photoRules.js'

// Tarayıcıda çalışır: fotoğrafı uzun kenarı 600 piksel olacak şekilde küçültür, JPEG'e çevirir.
// Sonuç 80 KB'ı geçerse kalite 0.6 ile tekrar dener (SPEC 5).
export async function compressImage(file) {
  const bitmap = await createImageBitmap(file)
  try {
    const { width, height } = scaledSize(bitmap.width, bitmap.height)
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const context = canvas.getContext('2d')
    // Saydam PNG'nin arkası JPEG'de siyah olmasın.
    context.fillStyle = '#ffffff'
    context.fillRect(0, 0, width, height)
    context.drawImage(bitmap, 0, 0, width, height)

    let src = canvas.toDataURL('image/jpeg', PHOTO_QUALITY)
    if (dataUrlBytes(src) > PHOTO_MAX_OUTPUT_BYTES) src = canvas.toDataURL('image/jpeg', PHOTO_RETRY_QUALITY)
    return { src, width, height }
  } finally {
    bitmap.close()
  }
}

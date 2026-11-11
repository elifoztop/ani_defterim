import { useState } from 'react'
import { checkPhotoFile } from '../lib/photoRules.js'
import { compressImage } from '../lib/imageCompress.js'
import { PHOTO_LIMIT_RATIO } from '../state/constants.js'
import { wouldExceed } from '../state/storage.js'
import { MESSAGES } from '../lib/messages.js'

// Yeni fotoğrafın kayıtta kaplayacağı ek yer (nesnenin diğer alanları için pay).
const ITEM_OVERHEAD = 300

export function usePhotoUpload({ storage, onAdd, onError }) {
  const [loading, setLoading] = useState(false)

  const upload = async (file, pageId) => {
    const problem = checkPhotoFile(file)
    if (problem) {
      onError(problem === 'type' ? MESSAGES.photoType : MESSAGES.photoSize)
      return
    }
    setLoading(true)
    try {
      const photo = await compressImage(file)
      if (wouldExceed(storage, photo.src.length + ITEM_OVERHEAD, PHOTO_LIMIT_RATIO)) {
        onError(MESSAGES.photoStorage)
        return
      }
      onAdd(pageId, photo)
    } catch (error) {
      console.error('Fotoğraf açılamadı:', error)
      onError(MESSAGES.photoRead)
    } finally {
      setLoading(false)
    }
  }

  return { loading, upload }
}

import { useEffect, useEffectEvent, useLayoutEffect } from 'react'
import { PAGE_W } from '../state/constants.js'

// Yazının gerçek yüksekliğini DOM'dan ölçer ve sayfa birimine çevirir (SPEC 3, karar 33).
// Yalnızca düzenleme dışındayken ölçer. Yükseklik değişmediyse eylem göndermez.
export function useTextMeasure(ref, item, editing, onMeasure) {
  const measure = useEffectEvent(() => {
    const element = ref.current
    const page = element?.closest('.page')
    if (!element || !page || page.clientWidth === 0) return
    const h = element.offsetHeight / (page.clientWidth / PAGE_W)
    if (Math.abs(h - item.h) > 0.5) onMeasure(h)
  })

  const { content, font, size, bold, italic, align } = item.props
  useLayoutEffect(() => {
    if (!editing) measure()
  }, [editing, content, font, size, bold, italic, align, item.w])

  // Fontlar sonradan yüklenirse yükseklik değişir.
  useEffect(() => {
    let active = true
    document.fonts?.ready.then(() => {
      if (active) measure()
    })
    return () => {
      active = false
    }
  }, [])
}

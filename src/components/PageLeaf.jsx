import { useState } from 'react'

// Açık defter değişince bir kağıt yaprağı cilt çevresinde döner (SPEC 10, "zaman kalırsa", karar 99).
// İleri giderken sağ sayfa kapanır, geri giderken sol sayfa. Yaprak boştur; arka yüzü görünmez.
// Yalnızca görseldir: veriye dokunmaz, tıklamaları engellemez.
export default function PageLeaf({ spreadIndex }) {
  const [flip, setFlip] = useState({ spread: spreadIndex, direction: null, id: 0 })

  // Önceki render'daki açık defterle karşılaştırma (React'in önerdiği "önceki değeri saklama" deseni).
  if (flip.spread !== spreadIndex) {
    setFlip({
      spread: spreadIndex,
      direction: spreadIndex > flip.spread ? 'forward' : 'back',
      id: flip.id + 1,
    })
  }

  if (!flip.direction) return null
  return <span key={flip.id} className={`notebook__leaf notebook__leaf--${flip.direction}`} aria-hidden="true" />
}

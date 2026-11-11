import { useState } from 'react'

// Sürüklerken ara açı yerel durumdadır ve önizleme olarak gösterilir.
// Bırakınca reducer'a tek eylem gider (SPEC 7.1).
export default function RotationSlider({ rotation, onPreview, onCommit }) {
  const [value, setValue] = useState(null)
  const shown = value ?? Math.round(rotation)

  const change = (event) => {
    const next = Number(event.target.value)
    setValue(next)
    onPreview(next)
  }
  const finish = () => {
    if (value === null) return
    onCommit(value)
    onPreview(null)
    setValue(null)
  }

  return (
    <label className="props__field">
      <span className="props__label">
        Döndürme <output>{shown}°</output>
      </span>
      <input
        type="range"
        min={-180}
        max={180}
        step={1}
        value={shown}
        onChange={change}
        onPointerDown={(event) => event.currentTarget.setPointerCapture(event.pointerId)}
        onPointerUp={finish}
        onKeyUp={finish}
        onBlur={finish}
      />
    </label>
  )
}

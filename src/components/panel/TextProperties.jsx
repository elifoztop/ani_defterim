import Icon from '../Icon.jsx'
import {
  ALIGN_OPTIONS,
  FONT_OPTIONS,
  TEXT_SIZE_MAX,
  TEXT_SIZE_MIN,
  canItalic,
  clampTextSize,
} from '../../lib/textStyle.js'

const ALIGN_ICONS = { left: 'alignLeft', center: 'alignCenter', right: 'alignRight' }

function SizeControl({ size, onSize }) {
  return (
    <div className="props__row">
      <button type="button" className="btn btn--icon" aria-label="Küçült" disabled={size <= TEXT_SIZE_MIN} onClick={() => onSize(size - 2)}>
        <Icon name="minus" />
      </button>
      <input
        key={size}
        className="props__number"
        type="number"
        min={TEXT_SIZE_MIN}
        max={TEXT_SIZE_MAX}
        defaultValue={size}
        aria-label="Yazı boyutu"
        onBlur={(event) => onSize(event.target.value)}
        onKeyDown={(event) => event.key === 'Enter' && onSize(event.currentTarget.value)}
      />
      <button type="button" className="btn btn--icon" aria-label="Büyüt" disabled={size >= TEXT_SIZE_MAX} onClick={() => onSize(size + 2)}>
        <Icon name="plus" />
      </button>
    </div>
  )
}

export default function TextProperties({ props, onChange }) {
  const italicAllowed = canItalic(props.font)
  const setSize = (value) => {
    const size = clampTextSize(value)
    if (size !== null && size !== props.size) onChange({ size })
  }

  return (
    <div className="props__group">
      <span className="props__label">Yazı tipi</span>
      <div className="props__segmented">
        {FONT_OPTIONS.map((option) => (
          <button
            key={option.id}
            type="button"
            className="btn props__option"
            aria-pressed={props.font === option.id}
            style={{ fontFamily: option.family }}
            onClick={() => onChange({ font: option.id })}
          >
            {option.label}
          </button>
        ))}
      </div>

      <span className="props__label">Boyut</span>
      <SizeControl size={props.size} onSize={setSize} />

      <span className="props__label">Biçim ve hizalama</span>
      <div className="props__row">
        <button type="button" className="btn btn--icon props__style" aria-label="Kalın" title="Kalın" aria-pressed={props.bold} onClick={() => onChange({ bold: !props.bold })}>
          <b>K</b>
        </button>
        <span title={italicAllowed ? 'İtalik' : 'El yazısı fontunun italik biçimi yok.'}>
          <button
            type="button"
            className="btn btn--icon props__style"
            aria-label="İtalik"
            aria-pressed={props.italic && italicAllowed}
            disabled={!italicAllowed}
            onClick={() => onChange({ italic: !props.italic })}
          >
            <i>İ</i>
          </button>
        </span>
        <span className="props__spacer" />
        {ALIGN_OPTIONS.map((option) => (
          <button
            key={option.id}
            type="button"
            className="btn btn--icon"
            aria-label={option.label}
            title={option.label}
            aria-pressed={props.align === option.id}
            onClick={() => onChange({ align: option.id })}
          >
            <Icon name={ALIGN_ICONS[option.id]} />
          </button>
        ))}
      </div>
    </div>
  )
}

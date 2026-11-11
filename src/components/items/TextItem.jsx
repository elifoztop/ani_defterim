import { useRef } from 'react'
import TextEditor from './TextEditor.jsx'
import { resolveTextStyle } from '../../lib/textStyle.js'
import { useTextMeasure } from '../../hooks/useTextMeasure.js'

export default function TextItem({ item, editing, onMeasure, onCommit, onExit }) {
  const ref = useRef(null)
  useTextMeasure(ref, item, editing, onMeasure)

  const resolved = resolveTextStyle(item.props)
  const style = { ...resolved, fontSize: `calc(var(--u) * ${resolved.fontSize})` }

  if (editing) {
    return <TextEditor initial={item.props.content} style={style} onCommit={onCommit} onExit={onExit} />
  }
  return (
    <div ref={ref} className="text-item" style={style}>
      {item.props.content}
    </div>
  )
}

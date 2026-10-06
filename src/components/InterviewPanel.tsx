import { useState } from 'react'
import { interviewFor } from '../content'
import type { InterviewItem } from '../types'
import { Html } from './Html'

function QaCard({ item }: { item: InterviewItem }) {
  const [open, setOpen] = useState(false)
  const toggle = () => {
    setOpen((o) => !o)
  }
  return (
    <div
      className={`qa-card${open ? ' open' : ''}`}
      role="button"
      tabIndex={0}
      aria-expanded={open}
      onClick={toggle}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          toggle()
        }
      }}
    >
      <div className="qa-q">
        <Html html={item.q} />
      </div>
      <div className="qa-a">
        <Html html={item.a} />
      </div>
      <div className="qa-hint">Click to reveal</div>
    </div>
  )
}

export function InterviewPanel({ pageId }: { pageId: number }) {
  const items = interviewFor(pageId)
  if (items.length === 0) return <p className="panel-empty">No interview questions for this section.</p>

  return (
    <div>
      <h3 className="panel-heading">Say it out loud</h3>
      <p className="panel-intro">
        Answer aloud before revealing. Explaining is a harder test than recognising, which is exactly why it works.
      </p>
      {items.map((item, i) => (
        <QaCard key={`${pageId}-${i}`} item={item} />
      ))}
    </div>
  )
}

import { LESSONS, REVIEW_ID } from '../content'
import { useCourseStats, useProgress } from '../state/useProgress'
import type { SectionKey } from '../types'

const SECTIONS: readonly { key: SectionKey; title: string }[] = [
  { key: 'start', title: 'Start here' },
  { key: 'week1', title: 'Week 1 \u2014 C# core' },
  { key: 'week2', title: 'Week 2 \u2014 ASP.NET Core' },
]

interface SidebarProps {
  open: boolean
  onNavigate: (id: number) => void
}

export function Sidebar({ open, onNavigate }: SidebarProps) {
  const { state } = useProgress()
  const { done, total, percent, due } = useCourseStats()

  return (
    <nav className={`sidebar${open ? ' open' : ''}`} aria-label="Course sections">
      <div className="brand">
        <div className="brand-title">C# &amp; .NET Mastery</div>
        <div className="brand-sub">Understand it. Build it. Retain it.</div>
      </div>

      <div className="progress-wrap">
        <div
          className="progress-track"
          role="progressbar"
          aria-label="Course progress"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={percent}
        >
          <div className="progress-fill" style={{ width: `${percent}%` }} />
        </div>
        <div className="progress-meta">
          <span>{percent}%</span>
          <span>
            {done} / {total}
          </span>
        </div>
      </div>

      {SECTIONS.map((section) => (
        <div key={section.key}>
          <div className="sb-section">{section.title}</div>
          {LESSONS.filter((lesson) => lesson.section === section.key).map((lesson) => {
            const classes = ['sb-item']
            if (state.current === lesson.id) classes.push('active')
            if (state.doneIds.includes(lesson.id)) classes.push('done')
            return (
              <button
                key={lesson.id}
                type="button"
                className={classes.join(' ')}
                aria-current={state.current === lesson.id ? 'page' : undefined}
                onClick={() => { onNavigate(lesson.id) }}
              >
                <span className="sb-num">{lesson.badge}</span>
                <span className="sb-label">{lesson.label}</span>
                <span className="sb-check" aria-label="Completed">&#10003;</span>
              </button>
            )
          })}
        </div>
      ))}

      <div className="sb-section">Retention</div>
      <button
        type="button"
        className={`sb-item${state.current === REVIEW_ID ? ' active' : ''}`}
        aria-current={state.current === REVIEW_ID ? 'page' : undefined}
        onClick={() => { onNavigate(REVIEW_ID) }}
      >
        <span className="sb-num">&#8635;</span>
        <span className="sb-label">Review Center</span>
        {due.length > 0 && <span className="sb-badge">{due.length}</span>}
      </button>
    </nav>
  )
}

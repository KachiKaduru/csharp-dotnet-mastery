import { useState } from 'react'
import type { PanelTab } from '../types'
import { ChallengePanel } from './ChallengePanel'
import { InterviewPanel } from './InterviewPanel'
import { QuizPanel } from './QuizPanel'

const TABS: readonly { key: PanelTab; label: string }[] = [
  { key: 'quiz', label: 'Quiz' },
  { key: 'challenge', label: 'Challenge' },
  { key: 'interview', label: 'Interview' },
]

interface RightPanelProps {
  pageId: number
  collapsed: boolean
}

export function RightPanel({ pageId, collapsed }: RightPanelProps) {
  const [tab, setTab] = useState<PanelTab>('quiz')

  return (
    <aside className={`right${collapsed ? ' collapsed' : ''}`} aria-label="Practice panel">
      <div className="rtabs" role="tablist">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            role="tab"
            aria-selected={tab === t.key}
            className={`rtab${tab === t.key ? ' active' : ''}`}
            onClick={() => { setTab(t.key) }}
          >
            {t.label}
          </button>
        ))}
      </div>
      {/* All panels stay mounted so scratchpad drafts survive tab switches. */}
      <div className="rbody">
        <div role="tabpanel" hidden={tab !== 'quiz'}>
          <QuizPanel pageId={pageId} />
        </div>
        <div role="tabpanel" hidden={tab !== 'challenge'}>
          <ChallengePanel pageId={pageId} />
        </div>
        <div role="tabpanel" hidden={tab !== 'interview'}>
          <InterviewPanel key={pageId} pageId={pageId} />
        </div>
      </div>
    </aside>
  )
}

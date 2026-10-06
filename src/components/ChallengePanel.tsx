import { useState } from 'react'
import { challengesFor } from '../content'
import { useProgress } from '../state/useProgress'
import { CodeBlock } from './CodeBlock'
import { Html } from './Html'

export function ChallengePanel({ pageId }: { pageId: number }) {
  const { state, dispatch } = useProgress()
  // Scratchpad drafts live in memory for the session, keyed per challenge.
  const [drafts, setDrafts] = useState<Record<string, string>>({})
  const [shown, setShown] = useState<Record<string, boolean>>({})

  const challenges = challengesFor(pageId)
  if (challenges.length === 0) return <p className="panel-empty">No coding challenge for this section.</p>

  const index = Math.min(Math.max(state.chIdx[pageId] ?? 0, 0), challenges.length - 1)
  const challenge = challenges[index]
  if (!challenge) return null

  const key = `${pageId}-${index}`
  const showSolution = shown[key] ?? false
  const go = (delta: number) => {
    dispatch({ type: 'setChallenge', id: pageId, index: index + delta })
  }

  return (
    <div>
      {challenges.length > 1 && (
        <div className="ch-nav">
          <button type="button" className="ch-nav-btn" disabled={index === 0} onClick={() => { go(-1) }}>
            &larr; Prev
          </button>
          <span className="ch-nav-label">
            Challenge {index + 1} / {challenges.length}
          </span>
          <button type="button" className="ch-nav-btn" disabled={index === challenges.length - 1} onClick={() => { go(1) }}>
            Next &rarr;
          </button>
        </div>
      )}

      <h3 className="panel-heading">
        <Html html={challenge.title} />
      </h3>
      <div className="ch-desc">
        <Html html={challenge.desc} />
      </div>

      {challenge.expected && (
        <div className="ch-expected">
          <span className="ch-label">Expected output</span>
          {challenge.expected}
        </div>
      )}

      <textarea
        className="ch-editor"
        spellCheck={false}
        aria-label="Code scratchpad"
        value={drafts[key] ?? challenge.starter}
        onChange={(e) => {
          setDrafts((d) => ({ ...d, [key]: e.target.value }))
        }}
      />

      <div className="ch-actions">
        <button
          type="button"
          className="btn btn-outline"
          onClick={() => {
            setDrafts((d) => {
              const next = { ...d }
              delete next[key]
              return next
            })
          }}
        >
          Reset
        </button>
        {challenge.solution && (
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => {
              setShown((s) => ({ ...s, [key]: !showSolution }))
            }}
          >
            {showSolution ? 'Hide solution' : 'Show solution'}
          </button>
        )}
      </div>

      {challenge.solution && showSolution && (
        <div className="ch-solution">
          <span className="ch-label">Model solution</span>
          <CodeBlock code={challenge.solution} language="csharp" style={{ margin: 0 }} />
        </div>
      )}

      <div className="callout ch-note">
        <div className="cl-title">Write it before you reveal it</div>
        The editor here is a scratchpad &mdash; it does not compile. Type the answer out anyway, then check. Reading a
        solution you have not attempted teaches almost nothing.
      </div>
    </div>
  )
}

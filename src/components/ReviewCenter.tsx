import { quizFor, titleOf, TRACKED_IDS } from '../content'
import { daysSince, intervalDays } from '../lib/srs'
import { useCourseStats, useProgress } from '../state/useProgress'

export function ReviewCenter({ onOpen }: { onOpen: (id: number) => void }) {
  const { state, dispatch, now } = useProgress()
  const { done, due } = useCourseStats()

  const scored = Object.entries(state.quizScores)
  const average = scored.length
    ? Math.round(
        scored.reduce((sum, [id, score]) => sum + (score / (quizFor(Number(id)).length || 1)) * 100, 0) / scored.length,
      )
    : null

  const upcoming = state.doneIds.filter((id) => !due.includes(id) && TRACKED_IDS.includes(id))

  return (
    <div>
      <div className="tag">Retention</div>
      <h1>Review Center</h1>
      <p className="subtitle">
        Learning is what survives a week later. This page tracks what you have completed and resurfaces it on a widening
        schedule &mdash; 1 day, then 3, 7, 21, 60.
      </p>

      <div className="rev-grid">
        <div className="rev-stat">
          <div className="rev-stat-num">{done}</div>
          <div className="rev-stat-label">Sections done</div>
        </div>
        <div className="rev-stat">
          <div className="rev-stat-num">{due.length}</div>
          <div className="rev-stat-label">Due for review</div>
        </div>
        <div className="rev-stat">
          <div className="rev-stat-num">{average === null ? '\u2014' : `${average}%`}</div>
          <div className="rev-stat-label">Average quiz</div>
        </div>
      </div>

      {state.doneIds.length === 0 ? (
        <div className="callout">
          <div className="cl-title">Nothing scheduled yet</div>
          Finish a section and press <strong>Mark complete</strong>. It enters the review schedule from that moment.
        </div>
      ) : (
        <>
          <h2>Due now</h2>
          {due.length === 0 ? (
            <div className="callout tip">
              <div className="cl-title">All caught up</div>
              Nothing is due. Come back tomorrow, or carry on with new material.
            </div>
          ) : (
            <>
              <p className="review-note">
                For each one: <strong>answer the self-check questions from memory first</strong>, then open the section
                to check. Be honest about which button you press &mdash; the schedule only works if the signal is real.
              </p>
              {due.map((id) => (
                <div className="rev-row due" key={id}>
                  <span className="rev-title">{titleOf(id)}</span>
                  <span className="rev-meta">{Math.floor(daysSince(state.lastReviewed[id] ?? now, now))}d ago</span>
                  <button type="button" className="btn btn-outline btn-tiny" onClick={() => { onOpen(id) }}>
                    Open
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary btn-tiny"
                    onClick={() => { dispatch({ type: 'markReviewed', id, now: Date.now() }) }}
                  >
                    Recalled it
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline btn-tiny"
                    onClick={() => { dispatch({ type: 'resetReview', id, now: Date.now() }) }}
                  >
                    Forgot it
                  </button>
                </div>
              ))}
            </>
          )}

          <h2>Schedule</h2>
          {upcoming.map((id) => {
            const passes = state.reviewCount[id] ?? 0
            const left = Math.ceil(intervalDays(passes) - daysSince(state.lastReviewed[id] ?? now, now))
            return (
              <div className="rev-row" key={id}>
                <span className="rev-title">{titleOf(id)}</span>
                <span className="rev-meta">
                  review {left <= 0 ? 'now' : `in ${left}d`} &middot; pass {passes + 1}
                </span>
              </div>
            )
          })}
        </>
      )}

      <h2>How this works</h2>
      <p className="review-note">
        Re-reading feels productive and does very little. <strong>Retrieving</strong> from memory is what builds durable
        recall, and it works best just as something starts to fade. That is why the gaps widen: each successful recall
        pushes the next review further out, and a failure drops it back to one day.
      </p>
      <p className="review-note">
        So the useful loop is: <strong>try to answer before you look</strong>. The discomfort of a blank is the
        mechanism, not a sign you are doing it wrong.
      </p>
    </div>
  )
}

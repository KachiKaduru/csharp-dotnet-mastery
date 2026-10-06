import { quizFor } from '../content'
import { useProgress } from '../state/useProgress'
import { CodeBlock } from './CodeBlock'
import { Html } from './Html'

const LETTERS = ['A', 'B', 'C', 'D'] as const

export function QuizPanel({ pageId }: { pageId: number }) {
  const { state, dispatch } = useProgress()
  const questions = quizFor(pageId)

  if (questions.length === 0) {
    return (
      <p className="panel-empty">
        No quiz for this section &mdash; read it through, then use the self-check at the bottom of the page.
      </p>
    )
  }

  const answers = state.quizAnswered[pageId] ?? {}
  const answeredCount = Object.keys(answers).length
  const complete = answeredCount === questions.length
  const score = state.quizScores[pageId]
  const attempts = score === undefined ? [] : [...(state.quizHistory[pageId] ?? []), score]

  return (
    <div>
      <h3 className="panel-heading">Quiz &mdash; {questions.length} questions</h3>
      <p className="panel-intro">
        Answer before checking the page. A wrong answer you thought about beats a right one you looked up.
      </p>

      {questions.map((q, qi) => {
        const chosen = answers[qi]
        const locked = chosen !== undefined
        return (
          <div className="qcard" key={qi}>
            <div className="qtext">
              Q{qi + 1}. <Html html={q.q} />
            </div>
            {q.code && <CodeBlock code={q.code} language="csharp" style={{ marginBottom: 10 }} />}
            {q.opts.map((opt, oi) => {
              const classes = ['qopt']
              if (locked) {
                classes.push('locked')
                if (oi === q.correct) classes.push('correct')
                else if (oi === chosen) classes.push('wrong')
              }
              return (
                <button
                  key={oi}
                  type="button"
                  className={classes.join(' ')}
                  aria-disabled={locked}
                  onClick={() => { dispatch({ type: 'answer', id: pageId, question: qi, option: oi }) }}
                >
                  <span className="qletter">{LETTERS[oi]}</span>
                  <span>{opt}</span>
                </button>
              )
            })}
            <div className={`qexpl${locked ? ' show' : ''}`}>
              <Html html={q.expl} />
            </div>
            {locked && (
              <div className="qretry">
                <button
                  type="button"
                  className="btn btn-outline btn-tiny"
                  onClick={() => { dispatch({ type: 'clearAnswer', id: pageId, question: qi }) }}
                >
                  {'\u21ba'} Retry this question
                </button>
              </div>
            )}
          </div>
        )
      })}

      {complete && score !== undefined && (
        <div className="quiz-score">
          <div className="qs-num">
            {score}/{questions.length}
          </div>
          <div className="qs-label">Quiz score</div>
        </div>
      )}
      {attempts.length > 1 && (
        <div className="quiz-attempts">
          Attempts: {attempts.map((s) => `${s}/${questions.length}`).join(' \u2192 ')}
        </div>
      )}

      {answeredCount > 0 && (
        <div className="quiz-reset">
          <button type="button" className="btn btn-outline" onClick={() => { dispatch({ type: 'retake', id: pageId }) }}>
            {complete ? '\u21ba Retake quiz' : `\u21ba Reset quiz (${answeredCount}/${questions.length} answered)`}
          </button>
        </div>
      )}
    </div>
  )
}

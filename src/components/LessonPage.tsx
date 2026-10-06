import { Fragment } from 'react'
import type { Lesson } from '../types'
import { Html } from './Html'
import { LessonBody } from './LessonBody'

interface LessonPageProps {
  lesson: Lesson
  onComplete: (id: number) => void
}

export function LessonPage({ lesson, onComplete }: LessonPageProps) {
  return (
    <article>
      <div className="tag">{lesson.tag}</div>
      <h1>{lesson.title}</h1>
      <p className="subtitle">
        <Html html={lesson.subtitle} />
      </p>

      <div className="stepper">
        {lesson.steps.map((step, i) => (
          <Fragment key={step}>
            {i > 0 && <span className="step-arrow">&middot;</span>}
            <div className="step">{step}</div>
          </Fragment>
        ))}
      </div>

      <LessonBody html={lesson.body} />

      <section className="selfcheck">
        <h3>Can you explain these without notes?</h3>
        <p className="selfcheck-hint">
          If any answer is blank, that is the part to re-read &mdash; not the whole page. Mark it in the Review Center.
        </p>
        <ol>
          {lesson.selfCheck.map((question) => (
            <li key={question}>
              <Html html={question} />
            </li>
          ))}
        </ol>
      </section>

      <div className="complete-row">
        <button type="button" className="btn btn-primary" onClick={() => { onComplete(lesson.id) }}>
          Mark complete
        </button>
        <span className="complete-hint">Only after the self-check above.</span>
      </div>
    </article>
  )
}

import { describe, expect, it } from 'vitest'
import { quizFor } from '../content'
import { createInitialState, progressReducer, type ProgressState } from './progress'

const ID = 0
const questions = quizFor(ID)

function answerAll(state: ProgressState, pick: (correct: number) => number): ProgressState {
  return questions.reduce(
    (s, q, i) => progressReducer(s, { type: 'answer', id: ID, question: i, option: pick(q.correct) }),
    state,
  )
}

describe('quiz flow', () => {
  it('has quiz content to test against', () => {
    expect(questions.length).toBeGreaterThan(1)
  })

  it('scores only once every question is answered', () => {
    const partial = progressReducer(createInitialState(), { type: 'answer', id: ID, question: 0, option: 0 })
    expect(partial.quizScores[ID]).toBeUndefined()

    const perfect = answerAll(createInitialState(), (correct) => correct)
    expect(perfect.quizScores[ID]).toBe(questions.length)
  })

  it('locks an answer once given', () => {
    const first = progressReducer(createInitialState(), { type: 'answer', id: ID, question: 0, option: 1 })
    const second = progressReducer(first, { type: 'answer', id: ID, question: 0, option: 2 })
    expect(second).toBe(first)
  })

  it('drops the score when an answer is cleared and recomputes after re-answering', () => {
    const perfect = answerAll(createInitialState(), (correct) => correct)
    const cleared = progressReducer(perfect, { type: 'clearAnswer', id: ID, question: 0 })
    expect(cleared.quizScores[ID]).toBeUndefined()

    const wrong = (questions[0]?.correct ?? 0) === 0 ? 1 : 0
    const redone = progressReducer(cleared, { type: 'answer', id: ID, question: 0, option: wrong })
    expect(redone.quizScores[ID]).toBe(questions.length - 1)
  })

  it('records finished attempts in history on retake', () => {
    const perfect = answerAll(createInitialState(), (correct) => correct)
    const retaken = progressReducer(perfect, { type: 'retake', id: ID })
    expect(retaken.quizAnswered[ID]).toBeUndefined()
    expect(retaken.quizScores[ID]).toBeUndefined()
    expect(retaken.quizHistory[ID]).toEqual([questions.length])
  })

  it('does not add history when resetting an unfinished quiz', () => {
    const partial = progressReducer(createInitialState(), { type: 'answer', id: ID, question: 0, option: 0 })
    expect(progressReducer(partial, { type: 'retake', id: ID }).quizHistory[ID]).toBeUndefined()
  })
})

describe('completion and review', () => {
  const now = 1_000_000

  it('schedules a lesson for review when it is first completed, without duplicating it', () => {
    const once = progressReducer(createInitialState(), { type: 'complete', id: 3, now })
    expect(once.doneIds).toEqual([3])
    expect(once.lastReviewed[3]).toBe(now)
    expect(once.reviewCount[3]).toBe(0)

    const twice = progressReducer(once, { type: 'complete', id: 3, now: now + 5 })
    expect(twice.doneIds).toEqual([3])
    expect(twice.lastReviewed[3]).toBe(now) // re-marking must not reset the schedule
  })

  it('advances the ladder on recall and resets it on a miss', () => {
    let s = progressReducer(createInitialState(), { type: 'complete', id: 3, now })
    s = progressReducer(s, { type: 'markReviewed', id: 3, now: now + 1 })
    s = progressReducer(s, { type: 'markReviewed', id: 3, now: now + 2 })
    expect(s.reviewCount[3]).toBe(2)

    s = progressReducer(s, { type: 'resetReview', id: 3, now: now + 3 })
    expect(s.reviewCount[3]).toBe(0)
    expect(s.lastReviewed[3]).toBe(now + 3)
  })
})

describe('navigation', () => {
  it('remembers the scroll position of the page being left', () => {
    const s = progressReducer({ ...createInitialState(), current: 2 }, { type: 'navigate', id: 5, leavingScrollTop: 480 })
    expect(s.current).toBe(5)
    expect(s.scrollPos[2]).toBe(480)
  })
})

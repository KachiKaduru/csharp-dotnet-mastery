import { quizFor } from '../content'

/** Everything that survives a page reload. Shape is kept compatible with the original single-file app. */
export interface ProgressState {
  current: number
  /** lessonId -> questionIndex -> chosen option index */
  quizAnswered: Record<number, Record<number, number>>
  /** lessonId -> score of the last fully answered quiz */
  quizScores: Record<number, number>
  /** lessonId -> scores of earlier attempts */
  quizHistory: Record<number, number[]>
  /** lessonId -> epoch ms of the last (re)view */
  lastReviewed: Record<number, number>
  /** lessonId -> number of successful reviews */
  reviewCount: Record<number, number>
  /** lessonId -> index of the challenge being shown */
  chIdx: Record<number, number>
  /** lessonId -> scrollTop when the lesson was left */
  scrollPos: Record<number, number>
  doneIds: number[]
}

export type ProgressAction =
  | { type: 'navigate'; id: number; leavingScrollTop: number }
  | { type: 'complete'; id: number; now: number }
  | { type: 'markReviewed'; id: number; now: number }
  | { type: 'resetReview'; id: number; now: number }
  | { type: 'answer'; id: number; question: number; option: number }
  | { type: 'clearAnswer'; id: number; question: number }
  | { type: 'retake'; id: number }
  | { type: 'setChallenge'; id: number; index: number }

export function createInitialState(): ProgressState {
  return {
    current: 0,
    quizAnswered: {},
    quizScores: {},
    quizHistory: {},
    lastReviewed: {},
    reviewCount: {},
    chIdx: {},
    scrollPos: {},
    doneIds: [],
  }
}

/** Returns a copy of `record` without `key`. */
function omit<T>(record: Record<number, T>, key: number): Record<number, T> {
  const copy = { ...record }
  delete copy[key]
  return copy
}

/** Recomputes (or clears) the stored score for a lesson after its answers changed. */
function withScore(state: ProgressState, id: number, answers: Record<number, number>): ProgressState {
  const questions = quizFor(id)
  const answered = Object.keys(answers).length
  const quizAnswered = { ...state.quizAnswered, [id]: answers }

  if (questions.length > 0 && answered === questions.length) {
    const score = questions.filter((q, i) => answers[i] === q.correct).length
    return { ...state, quizAnswered, quizScores: { ...state.quizScores, [id]: score } }
  }
  return { ...state, quizAnswered, quizScores: omit(state.quizScores, id) }
}

export function progressReducer(state: ProgressState, action: ProgressAction): ProgressState {
  switch (action.type) {
    case 'navigate':
      return {
        ...state,
        current: action.id,
        scrollPos: { ...state.scrollPos, [state.current]: action.leavingScrollTop },
      }

    case 'complete': {
      const doneIds = state.doneIds.includes(action.id) ? state.doneIds : [...state.doneIds, action.id]
      if (state.lastReviewed[action.id]) return { ...state, doneIds }
      return {
        ...state,
        doneIds,
        lastReviewed: { ...state.lastReviewed, [action.id]: action.now },
        reviewCount: { ...state.reviewCount, [action.id]: 0 },
      }
    }

    case 'markReviewed':
      return {
        ...state,
        lastReviewed: { ...state.lastReviewed, [action.id]: action.now },
        reviewCount: { ...state.reviewCount, [action.id]: (state.reviewCount[action.id] ?? 0) + 1 },
      }

    case 'resetReview':
      // Answered badly: back to the shortest interval.
      return {
        ...state,
        lastReviewed: { ...state.lastReviewed, [action.id]: action.now },
        reviewCount: { ...state.reviewCount, [action.id]: 0 },
      }

    case 'answer': {
      const answers = state.quizAnswered[action.id] ?? {}
      if (answers[action.question] !== undefined) return state // already locked in
      return withScore(state, action.id, { ...answers, [action.question]: action.option })
    }

    case 'clearAnswer':
      return withScore(state, action.id, omit(state.quizAnswered[action.id] ?? {}, action.question))

    case 'retake': {
      const score = state.quizScores[action.id]
      return {
        ...state,
        quizAnswered: omit(state.quizAnswered, action.id),
        quizScores: omit(state.quizScores, action.id),
        quizHistory:
          score === undefined
            ? state.quizHistory
            : { ...state.quizHistory, [action.id]: [...(state.quizHistory[action.id] ?? []), score] },
      }
    }

    case 'setChallenge':
      return { ...state, chIdx: { ...state.chIdx, [action.id]: action.index } }
  }
}

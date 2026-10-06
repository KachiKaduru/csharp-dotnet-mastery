import { describe, expect, it } from 'vitest'
import { REVIEW_ID } from '../content'
import { createInitialState } from './progress'
import { parsePersistedState } from './storage'

describe('parsePersistedState', () => {
  it('falls back to a fresh state for garbage input', () => {
    for (const bad of [null, 42, 'x', [], undefined]) {
      expect(parsePersistedState(bad)).toEqual(createInitialState())
    }
  })

  it('reads the shape written by the original single-file app', () => {
    const state = parsePersistedState({
      current: 4,
      quizAnswered: { '0': { '0': 1, '1': 2 } },
      quizScores: { '0': 3 },
      quizHistory: { '0': [1, 2] },
      lastReviewed: { '2': 1_700_000_000_000 },
      reviewCount: { '2': 1 },
      chIdx: { '5': 1 },
      scrollPos: { '4': 120 },
      doneIds: [2, 3],
    })
    expect(state.current).toBe(4)
    expect(state.quizAnswered[0]).toEqual({ 0: 1, 1: 2 })
    expect(state.quizHistory[0]).toEqual([1, 2])
    expect(state.doneIds).toEqual([2, 3])
  })

  it('drops unknown lesson ids and duplicate completions', () => {
    const state = parsePersistedState({ current: 12345, doneIds: [2, 2, 9999, 'x'] })
    expect(state.current).toBe(0)
    expect(state.doneIds).toEqual([2])
  })

  it('keeps the Review Center as a valid current page', () => {
    expect(parsePersistedState({ current: REVIEW_ID }).current).toBe(REVIEW_ID)
  })

  it('ignores values of the wrong type inside maps', () => {
    const state = parsePersistedState({ quizScores: { '1': 'three', '2': 2 }, scrollPos: { '1': null } })
    expect(state.quizScores).toEqual({ 2: 2 })
    expect(state.scrollPos).toEqual({})
  })
})

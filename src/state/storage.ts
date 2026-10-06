import { LESSONS, REVIEW_ID } from '../content'
import { createInitialState, type ProgressState } from './progress'

export const STORAGE_KEY = 'csharp_course_state'

type Json = Record<string, unknown>

function isRecord(value: unknown): value is Json {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function toNumberMap(value: unknown): Record<number, number> {
  const out: Record<number, number> = {}
  if (!isRecord(value)) return out
  for (const [key, v] of Object.entries(value)) {
    if (typeof v === 'number' && Number.isFinite(v)) out[Number(key)] = v
  }
  return out
}

function toNestedNumberMap(value: unknown): Record<number, Record<number, number>> {
  const out: Record<number, Record<number, number>> = {}
  if (!isRecord(value)) return out
  for (const [key, v] of Object.entries(value)) out[Number(key)] = toNumberMap(v)
  return out
}

function toNumberListMap(value: unknown): Record<number, number[]> {
  const out: Record<number, number[]> = {}
  if (!isRecord(value)) return out
  for (const [key, v] of Object.entries(value)) {
    if (Array.isArray(v)) out[Number(key)] = v.filter((n): n is number => typeof n === 'number')
  }
  return out
}

/** Turns untrusted JSON into a valid state, dropping anything that does not belong. */
export function parsePersistedState(raw: unknown): ProgressState {
  const fresh = createInitialState()
  if (!isRecord(raw)) return fresh

  const known = new Set(LESSONS.map((lesson) => lesson.id))
  const current = typeof raw.current === 'number' && (known.has(raw.current) || raw.current === REVIEW_ID) ? raw.current : fresh.current
  const doneIds = Array.isArray(raw.doneIds)
    ? [...new Set(raw.doneIds.filter((id): id is number => typeof id === 'number' && known.has(id)))]
    : []

  return {
    current,
    quizAnswered: toNestedNumberMap(raw.quizAnswered),
    quizScores: toNumberMap(raw.quizScores),
    quizHistory: toNumberListMap(raw.quizHistory),
    lastReviewed: toNumberMap(raw.lastReviewed),
    reviewCount: toNumberMap(raw.reviewCount),
    chIdx: toNumberMap(raw.chIdx),
    scrollPos: toNumberMap(raw.scrollPos),
    doneIds,
  }
}

export function loadState(): ProgressState {
  try {
    const text = window.localStorage.getItem(STORAGE_KEY)
    if (!text) return createInitialState()
    const raw: unknown = JSON.parse(text)
    return parsePersistedState(raw)
  } catch {
    return createInitialState()
  }
}

export function saveState(state: ProgressState): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // Storage may be full or disabled (private mode); progress simply will not persist.
  }
}

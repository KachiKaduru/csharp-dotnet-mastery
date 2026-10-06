import { use, useMemo } from 'react'
import { TRACKED_IDS } from '../content'
import { dueIds } from '../lib/srs'
import { ProgressContext, type ProgressContextValue } from './ProgressContext'

export function useProgress(): ProgressContextValue {
  const value = use(ProgressContext)
  if (!value) throw new Error('useProgress must be used inside <ProgressProvider>')
  return value
}

/** Derived numbers shared by the sidebar, review page and completion dialog. */
export function useCourseStats() {
  const { state, now } = useProgress()
  return useMemo(() => {
    const done = state.doneIds.filter((id) => TRACKED_IDS.includes(id)).length
    const total = TRACKED_IDS.length
    return {
      done,
      total,
      percent: total ? Math.round((done / total) * 100) : 0,
      due: dueIds(state, now),
    }
  }, [state, now])
}

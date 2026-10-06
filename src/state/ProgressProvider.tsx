import { useEffect, useReducer, useState, type ReactNode } from 'react'
import { ProgressContext } from './ProgressContext'
import { progressReducer } from './progress'
import { loadState, saveState } from './storage'

const NOW_REFRESH_MS = 60_000

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(progressReducer, undefined, loadState)
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    saveState(state)
  }, [state])

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(Date.now())
    }, NOW_REFRESH_MS)
    return () => {
      window.clearInterval(timer)
    }
  }, [])

  return <ProgressContext value={{ state, dispatch, now }}>{children}</ProgressContext>
}

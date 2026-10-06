import { createContext, type Dispatch } from 'react'
import type { ProgressAction, ProgressState } from './progress'

export interface ProgressContextValue {
  state: ProgressState
  dispatch: Dispatch<ProgressAction>
  /** Epoch ms, refreshed every minute so "due" badges stay current. */
  now: number
}

export const ProgressContext = createContext<ProgressContextValue | null>(null)

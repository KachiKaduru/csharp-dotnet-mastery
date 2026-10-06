/** Spaced-repetition ladder, in days. Each successful recall moves one rung up. */
export const INTERVALS_DAYS = [1, 3, 7, 21, 60] as const

const DAY_MS = 86_400_000

export interface ReviewSchedule {
  doneIds: readonly number[]
  lastReviewed: Readonly<Record<number, number>>
  reviewCount: Readonly<Record<number, number>>
}

/** Days to wait before the next review, given how many reviews have passed. */
export function intervalDays(reviewCount: number): number {
  const rung = Math.min(Math.max(reviewCount, 0), INTERVALS_DAYS.length - 1)
  return INTERVALS_DAYS[rung] ?? 1
}

/** Whole or fractional days elapsed since `timestamp`, never negative. */
export function daysSince(timestamp: number, now: number): number {
  return Math.max(0, (now - timestamp) / DAY_MS)
}

/** Completed lessons whose review interval has elapsed. */
export function dueIds(schedule: ReviewSchedule, now: number): number[] {
  return schedule.doneIds.filter((id) => {
    const last = schedule.lastReviewed[id]
    if (!last) return false
    return daysSince(last, now) >= intervalDays(schedule.reviewCount[id] ?? 0)
  })
}

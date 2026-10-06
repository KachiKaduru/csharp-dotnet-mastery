import { describe, expect, it } from 'vitest'
import { daysSince, dueIds, intervalDays } from './srs'

const DAY = 86_400_000

describe('intervalDays', () => {
  it('climbs the 1, 3, 7, 21, 60 ladder and then stays at the top', () => {
    expect([0, 1, 2, 3, 4, 5, 99].map(intervalDays)).toEqual([1, 3, 7, 21, 60, 60, 60])
  })

  it('treats negative counts as the first rung', () => {
    expect(intervalDays(-3)).toBe(1)
  })
})

describe('daysSince', () => {
  it('never goes negative when the clock is slightly behind', () => {
    expect(daysSince(1_000, 500)).toBe(0)
  })
})

describe('dueIds', () => {
  const now = 100 * DAY

  it('returns only completed lessons whose interval has elapsed', () => {
    const due = dueIds(
      {
        doneIds: [1, 2, 3, 4],
        lastReviewed: { 1: now - 2 * DAY, 2: now - 2 * DAY, 3: now - 0.5 * DAY },
        reviewCount: { 1: 0, 2: 1 }, // 1 day interval vs 3 day interval
      },
      now,
    )
    expect(due).toEqual([1]) // 2 is not yet due, 3 is too recent, 4 was never scheduled
  })
})

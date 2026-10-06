// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { LESSONS } from '../content'
import { buildSearchIndex, searchIndex } from './search'

describe('course search', () => {
  const index = buildSearchIndex(LESSONS)

  it('indexes every lesson', () => {
    const ids = new Set(index.map((entry) => entry.id))
    expect(ids.size).toBe(LESSONS.length)
  })

  it('splits lessons by h2 and links each chunk to a real anchor', () => {
    const anchors = index.filter((entry) => entry.hid !== null)
    expect(anchors.length).toBeGreaterThan(100)
    for (const lesson of LESSONS) {
      for (const heading of lesson.headings) {
        expect(index.some((e) => e.id === lesson.id && e.hid === heading.id)).toBe(true)
      }
    }
  })

  it('ignores queries shorter than two characters', () => {
    expect(searchIndex(index, 'a')).toEqual([])
    expect(searchIndex(index, '  ')).toEqual([])
  })

  it('finds content case-insensitively and caps results at 12', () => {
    const hits = searchIndex(index, 'ASYNC')
    expect(hits.length).toBeGreaterThan(0)
    expect(hits.length).toBeLessThanOrEqual(12)
    expect(hits[0]?.snippet.length).toBeGreaterThan(0)
  })

  it('reports no hits for nonsense', () => {
    expect(searchIndex(index, 'zzzqqqxxx-not-in-the-course')).toEqual([])
  })
})

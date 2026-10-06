import type { Lesson } from '../types'

export interface SearchEntry {
  id: number
  head: string
  /** Anchor id of the h2 this chunk belongs to, or null for the lesson intro. */
  hid: string | null
  text: string
}

export interface SearchHit {
  id: number
  head: string
  hid: string | null
  snippet: string
}

const MIN_QUERY_LENGTH = 2
const MAX_HITS = 12

function normalise(text: string): string {
  return text.replace(/\s+/g, ' ').trim()
}

function plainText(parser: DOMParser, html: string): string {
  return normalise(parser.parseFromString(html, 'text/html').body.textContent)
}

/** Splits every lesson into one searchable chunk per h2 section. */
export function buildSearchIndex(lessons: readonly Lesson[]): SearchEntry[] {
  const parser = new DOMParser()
  const index: SearchEntry[] = []

  for (const lesson of lessons) {
    let head = lesson.label
    let hid: string | null = null
    let buffer: string[] = [plainText(parser, lesson.subtitle), lesson.steps.join(' ')]

    const flush = () => {
      const text = normalise(buffer.join(' '))
      if (text) index.push({ id: lesson.id, head, hid, text })
      buffer = []
    }

    const doc = parser.parseFromString(lesson.body, 'text/html')
    for (const el of Array.from(doc.body.children)) {
      if (el.tagName === 'H2') {
        flush()
        head = normalise(el.textContent)
        hid = el.id || null
      } else {
        buffer.push(el.textContent)
      }
    }
    buffer.push(...lesson.selfCheck.map((q) => plainText(parser, q)))
    flush()
  }

  return index
}

export function searchIndex(index: readonly SearchEntry[], query: string): SearchHit[] {
  const q = query.trim().toLowerCase()
  if (q.length < MIN_QUERY_LENGTH) return []

  return index
    .filter((entry) => entry.text.toLowerCase().includes(q) || entry.head.toLowerCase().includes(q))
    .slice(0, MAX_HITS)
    .map((entry) => {
      const at = entry.text.toLowerCase().indexOf(q)
      const snippet = at < 0 ? entry.text.slice(0, 110) : entry.text.slice(Math.max(0, at - 40), at + 80)
      return { id: entry.id, head: entry.head, hid: entry.hid, snippet }
    })
}

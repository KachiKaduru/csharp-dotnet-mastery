export type SectionKey = 'start' | 'week1' | 'week2'

export interface Heading {
  id: string
  text: string
}

export interface Lesson {
  id: number
  /** Plain-text title used in the sidebar, top bar and review lists. */
  label: string
  section: SectionKey
  /** Glyph or number shown in the sidebar badge. */
  badge: string
  tag: string
  title: string
  /** Inline HTML. */
  subtitle: string
  steps: string[]
  /** Inline HTML, one entry per self-check question. */
  selfCheck: string[]
  headings: Heading[]
  /** Lesson body as an HTML string (see src/content/lessons/*.html). */
  body: string
}

export interface QuizQuestion {
  /** Inline HTML. */
  q: string
  /** Plain text options. */
  opts: string[]
  correct: number
  /** Inline HTML. */
  expl: string
  code?: string
}

export interface Challenge {
  /** Inline HTML. */
  title: string
  /** Inline HTML. */
  desc: string
  starter: string
  expected?: string
  solution?: string
}

export interface InterviewItem {
  /** Inline HTML. */
  q: string
  /** Inline HTML. */
  a: string
}

export type PanelTab = 'quiz' | 'challenge' | 'interview'

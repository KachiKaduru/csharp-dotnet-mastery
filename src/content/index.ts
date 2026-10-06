import type { Challenge, InterviewItem, Lesson, QuizQuestion, SectionKey } from '../types'
import challengeJson from './challenges.json'
import interviewJson from './interview.json'
import lessonJson from './lessons.json'
import quizJson from './quizzes.json'

/** Id of the Review Center pseudo-page (not a lesson, never tracked). */
export const REVIEW_ID = 99

const bodies = import.meta.glob<string>('./lessons/*.html', {
  query: '?raw',
  import: 'default',
  eager: true,
})

function isSectionKey(value: string): value is SectionKey {
  return value === 'start' || value === 'week1' || value === 'week2'
}

function bodyFor(id: number): string {
  const body = bodies[`./lessons/${id}.html`]
  if (body === undefined) throw new Error(`Missing lesson body: src/content/lessons/${id}.html`)
  return body
}

/** Every lesson, in sidebar order. */
export const LESSONS: readonly Lesson[] = lessonJson.map((meta) => {
  if (!isSectionKey(meta.section)) throw new Error(`Unknown section "${meta.section}" on lesson ${meta.id}`)
  return { ...meta, section: meta.section, body: bodyFor(meta.id) }
})

const lessonById = new Map(LESSONS.map((lesson) => [lesson.id, lesson]))

/** Ids of the lessons that count towards course progress. */
export const TRACKED_IDS: readonly number[] = LESSONS.map((lesson) => lesson.id)

export function getLesson(id: number): Lesson | undefined {
  return lessonById.get(id)
}

export function titleOf(id: number): string {
  if (id === REVIEW_ID) return 'Review Center'
  return lessonById.get(id)?.label ?? `Page ${id}`
}

const QUIZ: Record<string, QuizQuestion[]> = quizJson
const CHALLENGES: Record<string, Challenge[]> = challengeJson
const INTERVIEW: Record<string, InterviewItem[]> = interviewJson

export function quizFor(id: number): readonly QuizQuestion[] {
  return QUIZ[String(id)] ?? []
}

export function challengesFor(id: number): readonly Challenge[] {
  return CHALLENGES[String(id)] ?? []
}

export function interviewFor(id: number): readonly InterviewItem[] {
  return INTERVIEW[String(id)] ?? []
}

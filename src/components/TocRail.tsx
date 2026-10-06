import { useEffect, useState, type RefObject } from 'react'
import type { Lesson } from '../types'

interface TocRailProps {
  lesson: Lesson
  scrollRef: RefObject<HTMLElement | null>
  collapsed: boolean
}

const MIN_HEADINGS = 3
const ACTIVE_OFFSET_PX = 140

/** "On this page" rail with scroll-spy. Mount with `key={lesson.id}` so state resets per lesson. */
export function TocRail({ lesson, scrollRef, collapsed }: TocRailProps) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const { headings } = lesson

  useEffect(() => {
    const scroller = scrollRef.current
    if (!scroller) return
    const onScroll = () => {
      let active: string | null = null
      for (const { id } of headings) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top < ACTIVE_OFFSET_PX) active = id
      }
      setActiveId(active)
    }
    scroller.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      scroller.removeEventListener('scroll', onScroll)
    }
  }, [headings, scrollRef])

  if (headings.length < MIN_HEADINGS) return null

  return (
    <aside className={`toc-rail${collapsed ? ' collapsed' : ''}`} aria-label="On this page">
      <div className="toc-title">On this page</div>
      {headings.map((h) => (
        <button
          key={h.id}
          type="button"
          className={`toc-item${activeId === h.id ? ' active' : ''}`}
          onClick={() => { document.getElementById(h.id)?.scrollIntoView({ behavior: 'smooth' }) }}
        >
          {h.text}
        </button>
      ))}
    </aside>
  )
}

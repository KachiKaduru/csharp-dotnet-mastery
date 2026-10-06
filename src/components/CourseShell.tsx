import { useCallback, useEffect, useRef, useState } from 'react'
import { getLesson, LESSONS, REVIEW_ID, titleOf } from '../content'
import { useCourseStats, useProgress } from '../state/useProgress'
import { CelebrationModal } from './CelebrationModal'
import { LessonPage } from './LessonPage'
import { ReviewCenter } from './ReviewCenter'
import { RightPanel } from './RightPanel'
import { Sidebar } from './Sidebar'
import { TocRail } from './TocRail'
import { Topbar } from './Topbar'

const ANCHOR_SCROLL_DELAY_MS = 60

export function CourseShell() {
  const { state, dispatch } = useProgress()
  const { percent } = useCourseStats()
  const mainRef = useRef<HTMLElement>(null)

  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [rightCollapsed, setRightCollapsed] = useState(false)
  const [celebratingId, setCelebratingId] = useState<number | null>(null)

  const { current, scrollPos } = state
  const lesson = getLesson(current)

  const goTo = useCallback(
    (id: number) => {
      dispatch({ type: 'navigate', id, leavingScrollTop: mainRef.current?.scrollTop ?? 0 })
      setSidebarOpen(false)
    },
    [dispatch],
  )

  const nextPage = useCallback(() => {
    const i = LESSONS.findIndex((l) => l.id === current)
    const next = LESSONS[i + 1]
    if (i > -1 && next) goTo(next.id)
  }, [current, goTo])

  // Restore the saved scroll position whenever the visible page changes.
  useEffect(() => {
    mainRef.current?.scrollTo({ top: scrollPos[current] ?? 0, behavior: 'instant' })
    // Only re-run on navigation; scrollPos is rewritten as part of the same action.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key === 'ArrowRight') nextPage()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [nextPage])

  const jump = (id: number, anchor: string | null) => {
    goTo(id)
    if (anchor) {
      window.setTimeout(() => {
        document.getElementById(anchor)?.scrollIntoView({ behavior: 'smooth' })
      }, ANCHOR_SCROLL_DELAY_MS)
    }
  }

  const complete = (id: number) => {
    dispatch({ type: 'complete', id, now: Date.now() })
    setCelebratingId(id)
  }

  const closeCelebration = useCallback(() => {
    setCelebratingId(null)
  }, [])

  return (
    <div className={`app${rightCollapsed ? ' right-collapsed' : ''}`}>
      <Sidebar open={sidebarOpen} onNavigate={goTo} />
      {sidebarOpen && (
        <div
          className="sidebar-backdrop"
          onClick={() => {
            setSidebarOpen(false)
          }}
        />
      )}

      <main className="main" ref={mainRef}>
        <Topbar
          title={titleOf(current)}
          onMenu={() => {
            setSidebarOpen(true)
          }}
          onJump={jump}
        />
        <div className="wrap">
          {current === REVIEW_ID ? (
            <ReviewCenter onOpen={goTo} />
          ) : lesson ? (
            <LessonPage key={lesson.id} lesson={lesson} onComplete={complete} />
          ) : null}
        </div>
      </main>

      {lesson && <TocRail key={lesson.id} lesson={lesson} scrollRef={mainRef} collapsed={rightCollapsed} />}

      <button
        type="button"
        className={`right-toggle${rightCollapsed ? ' collapsed' : ''}`}
        aria-label={rightCollapsed ? 'Show practice panel' : 'Hide practice panel'}
        aria-expanded={!rightCollapsed}
        onClick={() => {
          setRightCollapsed((c) => !c)
        }}
      >
        {rightCollapsed ? '\u25c0' : '\u25b6'}
      </button>
      <RightPanel pageId={current} collapsed={rightCollapsed} />

      <CelebrationModal
        lessonId={celebratingId}
        percent={percent}
        onNext={() => {
          closeCelebration()
          nextPage()
        }}
        onClose={closeCelebration}
      />
    </div>
  )
}

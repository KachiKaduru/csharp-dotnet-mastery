import { useEffect } from 'react'
import { titleOf } from '../content'

interface CelebrationModalProps {
  lessonId: number | null
  percent: number
  onNext: () => void
  onClose: () => void
}

export function CelebrationModal({ lessonId, percent, onNext, onClose }: CelebrationModalProps) {
  const open = lessonId !== null

  useEffect(() => {
    if (!open) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open, onClose])

  if (lessonId === null) return null

  return (
    <div className="cel show" onClick={onClose}>
      <div
        className="cel-box"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cel-title"
        onClick={(e) => { e.stopPropagation() }}
      >
        <h2 id="cel-title">{titleOf(lessonId)} complete</h2>
        <p className="cel-msg">
          {percent}% of the course done. It is scheduled for review tomorrow {'\u2014'} the Review Center will tell you
          when.
        </p>
        <div className="cel-actions">
          <button type="button" className="btn btn-primary" autoFocus onClick={onNext}>
            Next section
          </button>
          <button type="button" className="btn btn-outline" onClick={onClose}>
            Stay here
          </button>
        </div>
      </div>
    </div>
  )
}

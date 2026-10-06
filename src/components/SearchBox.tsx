import { useEffect, useMemo, useRef, useState } from 'react'
import { LESSONS, titleOf } from '../content'
import { buildSearchIndex, searchIndex } from '../lib/search'

interface SearchBoxProps {
  onJump: (id: number, anchor: string | null) => void
}

function isEditable(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false
  return target.isContentEditable || target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement
}

export function SearchBox({ onJump }: SearchBoxProps) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const rootRef = useRef<HTMLDivElement>(null)

  const index = useMemo(() => buildSearchIndex(LESSONS), [])
  const hits = useMemo(() => searchIndex(index, query), [index, query])
  const showResults = open && query.trim().length >= 2

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      // "/" focuses search, but never while typing somewhere (e.g. "//" in the code scratchpad).
      if (e.key === '/' && !isEditable(e.target)) {
        e.preventDefault()
        inputRef.current?.focus()
      }
      if (e.key === 'Escape') setOpen(false)
    }
    const onPointerDown = (e: PointerEvent) => {
      if (rootRef.current && e.target instanceof Node && !rootRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('pointerdown', onPointerDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('pointerdown', onPointerDown)
    }
  }, [])

  const jump = (id: number, anchor: string | null) => {
    setOpen(false)
    setQuery('')
    onJump(id, anchor)
  }

  return (
    <div className="search" ref={rootRef}>
      <input
        ref={inputRef}
        className="search-input"
        type="search"
        placeholder="Search the course..."
        aria-label="Search the course"
        autoComplete="off"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value)
          setOpen(true)
        }}
        onFocus={() => { setOpen(true) }}
      />
      {showResults && (
        <div className="search-results show" aria-label="Search results">
          {hits.length === 0 ? (
            <div className="sr-item">
              <div className="sr-snip">No matches</div>
            </div>
          ) : (
            hits.map((hit, i) => (
              <button
                key={`${hit.id}-${hit.hid ?? 'intro'}-${i}`}
                type="button"
                className="sr-item"
                onClick={() => { jump(hit.id, hit.hid) }}
              >
                <div className="sr-day">{titleOf(hit.id)}</div>
                <div className="sr-head">{hit.head}</div>
                <div className="sr-snip">&hellip;{hit.snippet}&hellip;</div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  )
}

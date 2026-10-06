import { SearchBox } from './SearchBox'

interface TopbarProps {
  title: string
  onMenu: () => void
  onJump: (id: number, anchor: string | null) => void
}

export function Topbar({ title, onMenu, onJump }: TopbarProps) {
  return (
    <header className="topbar">
      <button type="button" className="menu-btn" aria-label="Open course menu" onClick={onMenu}>
        &#9776;
      </button>
      <span className="topbar-day">{title}</span>
      <SearchBox onJump={onJump} />
    </header>
  )
}

import { useRef, useState } from 'react'
import icons from '../ui/icons.jsx'

const VIEW_OPTIONS = [
  { value: 'month', label: 'Month' },
  { value: 'week', label: 'Week' },
  { value: 'day', label: 'Day' },
  { value: 'agenda', label: 'Agenda' },
]

function ViewSelector({ activeView, onViewChange }) {
  const [isOpen, setIsOpen] = useState(false)
  const buttonRef = useRef(null)
  const activeOption = VIEW_OPTIONS.find((option) => option.value === activeView) ?? VIEW_OPTIONS[0]

  function closeMenu() {
    setIsOpen(false)
    buttonRef.current?.focus()
  }

  function selectView(view) {
    onViewChange(view)
    closeMenu()
  }

  function handleKeyDown(event) {
    if (event.key === 'Escape' && isOpen) {
      event.preventDefault()
      closeMenu()
    }
  }

  return (
    <div className="view-selector" onKeyDown={handleKeyDown}>
      <button
        className="view-selector__button"
        type="button"
        aria-controls="calendar-view-menu"
        aria-expanded={isOpen}
        aria-haspopup="menu"
        ref={buttonRef}
        onClick={() => setIsOpen((open) => !open)}
      >
        {activeOption.label}
        {icons['chevron-down']}
      </button>

      {isOpen && (
        <div className="view-selector__menu" id="calendar-view-menu" role="menu" aria-label="Calendar view">
          {VIEW_OPTIONS.map((option) => (
            <button
              className="view-selector__option"
              type="button"
              role="menuitemradio"
              aria-checked={activeView === option.value}
              key={option.value}
              onClick={() => selectView(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default ViewSelector

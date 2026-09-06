import { useEffect, useRef, useState } from 'react'
import icons from '../ui/icons.jsx'

const VIEW_OPTIONS = [
  { value: 'day', label: 'Day', shortcut: 'D' },
  { value: 'week', label: 'Week', shortcut: 'W' },
  { value: 'month', label: 'Month', shortcut: 'M' },
  { value: 'year', label: 'Year', shortcut: 'Y' },
  { value: 'schedule', label: 'Schedule', shortcut: 'A' },
  { value: 'four-days', label: '4 days', shortcut: 'X' },
]

const DISPLAY_OPTIONS = [
  { value: 'weekends', label: 'Show weekends' },
  { value: 'declined-events', label: 'Show declined events' },
  { value: 'completed-tasks', label: 'Show completed tasks' },
]

function ViewSelector({ activeView, onViewChange }) {
  const [isOpen, setIsOpen] = useState(false)
  const [displayOptions, setDisplayOptions] = useState({
    weekends: true,
    'declined-events': true,
    'completed-tasks': true,
  })
  const buttonRef = useRef(null)
  const selectorRef = useRef(null)
  const activeOption = VIEW_OPTIONS.find((option) => option.value === activeView) ?? VIEW_OPTIONS[0]

  useEffect(() => {
    if (!isOpen) {
      return undefined
    }

    function closeOnOutsidePointer(event) {
      if (!selectorRef.current?.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('pointerdown', closeOnOutsidePointer)

    return () => {
      document.removeEventListener('pointerdown', closeOnOutsidePointer)
    }
  }, [isOpen])

  function closeMenu() {
    setIsOpen(false)
    buttonRef.current?.focus()
  }

  function selectView(view) {
    onViewChange(view)
    closeMenu()
  }

  function toggleDisplayOption(option) {
    setDisplayOptions((options) => ({
      ...options,
      [option]: !options[option],
    }))
  }

  function handleKeyDown(event) {
    if (event.key === 'Escape' && isOpen) {
      event.preventDefault()
      closeMenu()
    }
  }

  return (
    <div className="view-selector" onKeyDown={handleKeyDown} ref={selectorRef}>
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
              <span>{option.label}</span>
              <span className="view-selector__shortcut" aria-hidden="true">{option.shortcut}</span>
            </button>
          ))}
          <div className="view-selector__settings">
            {DISPLAY_OPTIONS.map((option) => (
              <button
                className="view-selector__setting"
                type="button"
                role="menuitemcheckbox"
                aria-checked={displayOptions[option.value]}
                key={option.value}
                onClick={() => toggleDisplayOption(option.value)}
              >
                <span className="view-selector__checkmark" aria-hidden="true">
                  {displayOptions[option.value] ? '✓' : ''}
                </span>
                <span>{option.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ViewSelector

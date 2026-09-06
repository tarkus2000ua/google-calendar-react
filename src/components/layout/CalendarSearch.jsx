import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { parseLocalDate } from '../../utils/dateHelpers.js'

const DATE_FORMATTER = new Intl.DateTimeFormat('en-US', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
})

const TIME_FORMATTER = new Intl.DateTimeFormat('en-US', {
  hour: 'numeric',
  minute: '2-digit',
})

function formatEventSchedule(event) {
  const start = parseLocalDate(event.start)

  return event.allDay
    ? `${DATE_FORMATTER.format(start)} · All day`
    : `${DATE_FORMATTER.format(start)} · ${TIME_FORMATTER.format(start)}`
}

function CalendarSearch({ events, onClose, onSelectEvent }) {
  const inputRef = useRef(null)
  const searchRef = useRef(null)
  const listboxId = useId()
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const normalizedQuery = query.trim().toLocaleLowerCase()
  const matchingEvents = useMemo(() => (
    normalizedQuery
      ? events.filter((event) => (
        event.title.toLocaleLowerCase().includes(normalizedQuery)
        || event.calendar.toLocaleLowerCase().includes(normalizedQuery)
      ))
      : []
  ), [events, normalizedQuery])
  const activeResultIndex = Math.min(activeIndex, Math.max(0, matchingEvents.length - 1))

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    function closeOnOutsidePointer(event) {
      if (!searchRef.current?.contains(event.target)) {
        onClose()
      }
    }

    document.addEventListener('pointerdown', closeOnOutsidePointer)

    return () => {
      document.removeEventListener('pointerdown', closeOnOutsidePointer)
    }
  }, [onClose])

  function selectEvent(event) {
    onSelectEvent(event)
    onClose()
  }

  function handleKeyDown(event) {
    if (event.key === 'Escape') {
      event.preventDefault()
      onClose()
      return
    }

    if (!matchingEvents.length) return

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActiveIndex((index) => (index + 1) % matchingEvents.length)
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActiveIndex((index) => (index - 1 + matchingEvents.length) % matchingEvents.length)
    }

    if (event.key === 'Enter') {
      event.preventDefault()
      selectEvent(matchingEvents[activeResultIndex])
    }
  }

  return (
    <div className="calendar-search" ref={searchRef}>
      <div className={`calendar-search__field${normalizedQuery ? ' calendar-search__field--expanded' : ''}`}>
        <svg className="calendar-search__icon" viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="10.8" cy="10.8" r="5.8" />
          <path d="m15.2 15.2 4.3 4.3" />
        </svg>
        <input
          aria-autocomplete="list"
          aria-controls={listboxId}
          aria-expanded={Boolean(normalizedQuery)}
          aria-label="Search calendar events"
          className="calendar-search__input"
          onChange={(event) => {
            setQuery(event.target.value)
            setActiveIndex(0)
          }}
          onKeyDown={handleKeyDown}
          placeholder="Search calendar"
          ref={inputRef}
          role="combobox"
          type="search"
          value={query}
        />
        <button
          aria-label={query ? 'Clear search' : 'Close search'}
          className="calendar-search__clear"
          onClick={() => (query ? setQuery('') : onClose())}
          type="button"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="m6 6 12 12M18 6 6 18" />
          </svg>
        </button>
      </div>

      {normalizedQuery && (
        <div className="calendar-search__results" id={listboxId} role="listbox" aria-label="Calendar search results">
          {matchingEvents.length ? matchingEvents.map((event, index) => (
            <button
              aria-selected={index === activeResultIndex}
              className="calendar-search__result"
              key={event.id}
              onClick={() => selectEvent(event)}
              onPointerMove={() => setActiveIndex(index)}
              role="option"
              type="button"
            >
              <span className={`calendar-search__result-color calendar-search__result-color--${event.color}`} aria-hidden="true" />
              <span className="calendar-search__result-copy">
                <span className="calendar-search__result-title">{event.title}</span>
                <span className="calendar-search__result-meta">{event.calendar} · {formatEventSchedule(event)}</span>
              </span>
            </button>
          )) : (
            <p className="calendar-search__empty" role="status">No matching events</p>
          )}
        </div>
      )}
    </div>
  )
}

export default CalendarSearch

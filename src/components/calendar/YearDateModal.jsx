import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import { isDateInRange, parseLocalDate, toDateKey } from '../../utils/dateHelpers.js'
import '../../styles/year-date-modal.css'

const VIEWPORT_PADDING = 12
const POPOVER_GAP = 12

const DAY_FORMATTER = new Intl.DateTimeFormat('en-US', { weekday: 'short' })
const TIME_FORMATTER = new Intl.DateTimeFormat('en-US', {
  hour: 'numeric',
  minute: '2-digit',
})

function clamp(value, minimum, maximum) {
  return Math.min(Math.max(value, minimum), maximum)
}

function getEventsForDate(date, events) {
  return events
    .filter((event) => isDateInRange(date, event.start, event.end))
    .sort((left, right) => {
      if (left.allDay !== right.allDay) return left.allDay ? -1 : 1

      return parseLocalDate(left.start).getTime() - parseLocalDate(right.start).getTime()
    })
}

function YearDateModal({ date, events, onClose, onOpenDay, onSelectEvent, trigger }) {
  const closeButtonRef = useRef(null)
  const dialogRef = useRef(null)
  const onCloseRef = useRef(onClose)
  const triggerRef = useRef(trigger)
  const titleId = useId()
  const [position, setPosition] = useState(null)
  const dateEvents = getEventsForDate(date, events)

  useEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])

  useEffect(() => {
    const focusFrame = window.requestAnimationFrame(() => closeButtonRef.current?.focus())

    function closeOnEscape(event) {
      if (event.key === 'Escape') {
        event.preventDefault()
        onCloseRef.current()
      }
    }

    function closeOnOutsidePointer(event) {
      const target = event.target

      if (!(target instanceof Element)) return
      if (dialogRef.current?.contains(target) || target.closest('[data-year-date]')) return

      onCloseRef.current()
    }

    document.addEventListener('keydown', closeOnEscape)
    document.addEventListener('pointerdown', closeOnOutsidePointer)

    return () => {
      window.cancelAnimationFrame(focusFrame)
      document.removeEventListener('keydown', closeOnEscape)
      document.removeEventListener('pointerdown', closeOnOutsidePointer)
      triggerRef.current?.focus()
    }
  }, [])

  useLayoutEffect(() => {
    triggerRef.current = trigger

    function updatePosition() {
      const anchor = triggerRef.current?.getBoundingClientRect()
      const dialog = dialogRef.current?.getBoundingClientRect()

      if (!anchor || !dialog) return

      const maximumLeft = Math.max(VIEWPORT_PADDING, window.innerWidth - dialog.width - VIEWPORT_PADDING)
      const maximumTop = Math.max(VIEWPORT_PADDING, window.innerHeight - dialog.height - VIEWPORT_PADDING)
      const left = anchor.left + (anchor.width - dialog.width) / 2
      const top = anchor.bottom + POPOVER_GAP

      setPosition({
        left: clamp(left, VIEWPORT_PADDING, maximumLeft),
        top: clamp(top, VIEWPORT_PADDING, maximumTop),
      })
    }

    updatePosition()
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)

    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [trigger])

  return (
    <section
      className={`year-date-modal${position ? ' year-date-modal--positioned' : ''}`}
      role="dialog"
      aria-labelledby={titleId}
      ref={dialogRef}
      style={position ?? undefined}
      tabIndex={-1}
    >
      <header className="year-date-modal__header">
        <button
          className="year-date-modal__date-button"
          type="button"
          aria-label={`Open ${date.toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'long',
            weekday: 'long',
            year: 'numeric',
          })} in day view`}
          onClick={() => onOpenDay(date)}
        >
          <span className="year-date-modal__weekday">{DAY_FORMATTER.format(date)}</span>
          <span className="year-date-modal__date" id={titleId}>{date.getDate()}</span>
        </button>
        <button
          className="year-date-modal__close"
          type="button"
          aria-label="Close date details"
          onClick={onClose}
          ref={closeButtonRef}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="m6 6 12 12M18 6 6 18" />
          </svg>
        </button>
      </header>

      {dateEvents.length ? (
        <div className="year-date-modal__events">
          {dateEvents.map((event) => (
            <button
              className={`year-date-modal__event year-date-modal__event--${event.color}`}
              type="button"
              aria-label={`Open details for ${event.title}`}
              data-event-chip="true"
              key={event.id}
              onClick={() => onSelectEvent(event, dialogRef.current, `${event.id}-${toDateKey(date)}`)}
            >
              <span className="year-date-modal__event-time">{event.allDay ? 'All day' : TIME_FORMATTER.format(parseLocalDate(event.start))}</span>
              <span className="year-date-modal__event-title">{event.title}</span>
            </button>
          ))}
        </div>
      ) : (
        <p className="year-date-modal__empty">No events scheduled.</p>
      )}
    </section>
  )
}

export default YearDateModal

import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import { isSameDay, parseLocalDate } from '../../utils/dateHelpers.js'
import '../../styles/event-detail-modal.css'

const DATE_FORMATTER = new Intl.DateTimeFormat('en-US', {
  day: 'numeric',
  month: 'long',
  weekday: 'long',
  year: 'numeric',
})

const TIME_FORMATTER = new Intl.DateTimeFormat('en-US', {
  hour: 'numeric',
  minute: '2-digit',
})

function getEventSchedule(event) {
  const start = parseLocalDate(event.start)
  const end = parseLocalDate(event.end)
  const isSingleDay = isSameDay(start, end)

  if (event.allDay) {
    return {
      date: isSingleDay
        ? DATE_FORMATTER.format(start)
        : `${DATE_FORMATTER.format(start)} – ${DATE_FORMATTER.format(end)}`,
      time: 'All day',
    }
  }

  return {
    date: isSingleDay
      ? DATE_FORMATTER.format(start)
      : `${DATE_FORMATTER.format(start)} – ${DATE_FORMATTER.format(end)}`,
    time: `${TIME_FORMATTER.format(start)} – ${TIME_FORMATTER.format(end)}`,
  }
}

const VIEWPORT_PADDING = 12
const POPOVER_GAP = 12

function clamp(value, minimum, maximum) {
  return Math.min(Math.max(value, minimum), maximum)
}

function EventDetailModal({ event, isCentered = false, onClose, trigger }) {
  const closeButtonRef = useRef(null)
  const dialogRef = useRef(null)
  const onCloseRef = useRef(onClose)
  const triggerRef = useRef(trigger)
  const titleId = useId()
  const [position, setPosition] = useState(null)
  const schedule = getEventSchedule(event)

  useEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])

  useEffect(() => {
    const focusFrame = window.requestAnimationFrame(() => closeButtonRef.current?.focus())

    function closeOnEscape(keyboardEvent) {
      if (keyboardEvent.key === 'Escape') {
        keyboardEvent.preventDefault()
        onCloseRef.current()
      }
    }

    function closeOnOutsidePointer(pointerEvent) {
      const target = pointerEvent.target

      if (!(target instanceof Element)) return
      if (dialogRef.current?.contains(target) || target.closest('[data-event-chip]')) return

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

    if (isCentered) return undefined

    function updatePosition() {
      const anchor = triggerRef.current?.getBoundingClientRect()
      const popover = dialogRef.current?.getBoundingClientRect()

      if (!anchor || !popover) return

      const maximumLeft = Math.max(VIEWPORT_PADDING, window.innerWidth - popover.width - VIEWPORT_PADDING)
      const maximumTop = Math.max(VIEWPORT_PADDING, window.innerHeight - popover.height - VIEWPORT_PADDING)
      const hasRoomOnRight = window.innerWidth - anchor.right - POPOVER_GAP >= popover.width
      const hasRoomOnLeft = anchor.left - POPOVER_GAP >= popover.width
      const left = hasRoomOnRight || !hasRoomOnLeft
        ? anchor.right + POPOVER_GAP
        : anchor.left - popover.width - POPOVER_GAP
      const top = anchor.top + (anchor.height - popover.height) / 2

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
  }, [event.id, isCentered, trigger])

  return (
    <section
      className={`event-detail-modal${isCentered ? ' event-detail-modal--centered' : position ? ' event-detail-modal--positioned' : ''}`}
      role="dialog"
      aria-labelledby={titleId}
      ref={dialogRef}
      style={isCentered ? undefined : position ?? undefined}
    >
      <header className="event-detail-modal__header">
        <div className="event-detail-modal__utilities" aria-hidden="true">
          <span className="event-detail-modal__utility">
            <svg viewBox="0 0 24 24">
              <path d="M6.5 8.5h11M10 5.5h4M9 8.5v9h6v-9" />
            </svg>
          </span>
          <span className="event-detail-modal__utility">
            <svg viewBox="0 0 24 24">
              <circle cx="12" cy="6" r="1.2" />
              <circle cx="12" cy="12" r="1.2" />
              <circle cx="12" cy="18" r="1.2" />
            </svg>
          </span>
        </div>
        <button
          className="event-detail-modal__close"
          type="button"
          aria-label="Close event details"
          ref={closeButtonRef}
          onClick={onClose}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="m6 6 12 12M18 6 6 18" />
          </svg>
        </button>
      </header>

      <div className="event-detail-modal__content">
        <span className={`event-detail-modal__color event-detail-modal__color--${event.color}`} aria-hidden="true" />
        <div>
          <h2 className="event-detail-modal__title" id={titleId}>{event.title}</h2>
          <p className="event-detail-modal__schedule">{schedule.date}</p>
        </div>

        <div className="event-detail-modal__details">
          <p className="event-detail-modal__detail">
            <span className="event-detail-modal__detail-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="7" />
                <path d="M12 8v4l2.8 1.8" />
              </svg>
            </span>
            <span>{schedule.time}</span>
          </p>
          <p className="event-detail-modal__detail">
            <span className="event-detail-modal__detail-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <rect x="5.5" y="6.5" width="13" height="12" rx="1.5" />
                <path d="M8.5 4.5v4M15.5 4.5v4M5.5 10h13" />
              </svg>
            </span>
            <span>{event.calendar}</span>
          </p>
        </div>
      </div>
    </section>
  )
}

export default EventDetailModal

import { useLayoutEffect, useRef } from 'react'
import {
  addDays,
  compareDates,
  isDateInRange,
  isSameDay,
  parseLocalDate,
  startOfDay,
  toDateKey,
} from '../../utils/dateHelpers.js'

const HOUR_HEIGHT = 56

function formatEventTime(value) {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(parseLocalDate(value))
}

function formatDraftTime(value) {
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    hour12: false,
    minute: '2-digit',
  }).format(value)
}

function getTimedEventSegment(event, date) {
  const dayStart = startOfDay(date)
  const nextDay = addDays(dayStart, 1)
  const eventStart = parseLocalDate(event.start)
  const eventEnd = parseLocalDate(event.end)

  if (eventEnd <= dayStart || eventStart >= nextDay) {
    return null
  }

  const segmentStart = eventStart > dayStart ? eventStart : dayStart
  const segmentEnd = eventEnd < nextDay ? eventEnd : nextDay
  const top = ((segmentStart.getTime() - dayStart.getTime()) / 3_600_000) * HOUR_HEIGHT
  const height = Math.max(((segmentEnd.getTime() - segmentStart.getTime()) / 3_600_000) * HOUR_HEIGHT, 22)

  return { height, top }
}

function TimeGridDayColumn({ area = 'timed', currentDate, currentTimeTop, date, draftEvent, events, onDraftAnchor, onSelectEvent, onSelectTime, selectedEventChipId }) {
  const isPastDate = compareDates(date, currentDate) < 0
  const draftChipRef = useRef(null)
  const draftSegment = draftEvent && isSameDay(date, draftEvent.date)
    ? getTimedEventSegment(draftEvent, date)
    : null

  useLayoutEffect(() => {
    if (!draftSegment || !draftChipRef.current) return

    if (draftEvent.reveal) {
      const scrollContainer = draftChipRef.current.closest('.week-view__scroll, .day-view__scroll')
      if (scrollContainer) {
        scrollContainer.scrollTop = Math.max(0, draftSegment.top - 160)
      }
    }

    onDraftAnchor(draftChipRef.current)
  }, [draftEvent, draftSegment, onDraftAnchor])

  if (area === 'all-day') {
    const allDayEvents = events.filter((event) => event.allDay && isDateInRange(date, event.start, event.end))

    return (
      <div className="week-view__all-day-cell">
        {allDayEvents.map((event) => {
          const eventChipId = `${event.id}-${toDateKey(date)}`

          return (
            <button
              className={`week-view__all-day-event week-view__event--${event.color}${isPastDate ? ' week-view__event--past' : ''}${selectedEventChipId === eventChipId ? ' week-view__event--selected' : ''}`}
              type="button"
              aria-label={`Open details for ${event.title}`}
              data-event-chip="true"
              title={event.title}
              key={eventChipId}
              onClick={(clickEvent) => {
                clickEvent.stopPropagation()
                onSelectEvent(event, clickEvent.currentTarget, eventChipId)
              }}
            >
              {event.title}
            </button>
          )
        })}
      </div>
    )
  }

  const today = isSameDay(date, currentDate)
  const timedEvents = events
    .filter((event) => !event.allDay)
    .map((event) => ({ event, segment: getTimedEventSegment(event, date) }))
    .filter(({ segment }) => segment)

  function selectTime(event) {
    if (!onSelectTime) return

    const bounds = event.currentTarget.getBoundingClientRect()
    const minutesFromDay = ((event.clientY - bounds.top) / HOUR_HEIGHT) * 60

    onSelectTime(date, minutesFromDay)
  }

  return (
    <div
      className="week-view__day-column"
      role="gridcell"
      tabIndex={0}
      onClick={selectTime}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onSelectTime?.(date)
        }
      }}
    >
      {today && (
        <div
          className="week-view__current-time"
          style={{ top: `${currentTimeTop}px` }}
          aria-label={`Current time ${formatEventTime(currentDate)}`}
        >
          <span className="week-view__current-time-dot" aria-hidden="true" />
        </div>
      )}
      {timedEvents.map(({ event, segment }) => {
        const eventChipId = `${event.id}-${toDateKey(date)}`

        return (
          <button
            className={`week-view__timed-event week-view__event--${event.color}${isPastDate ? ' week-view__event--past' : ''}${selectedEventChipId === eventChipId ? ' week-view__event--selected' : ''}`}
            type="button"
            aria-label={`Open details for ${event.title}`}
            data-event-chip="true"
            style={{ top: `${segment.top}px`, height: `${segment.height}px` }}
            title={`${event.title}, ${formatEventTime(event.start)}`}
            key={eventChipId}
            onClick={(clickEvent) => {
              clickEvent.stopPropagation()
              onSelectEvent(event, clickEvent.currentTarget, eventChipId)
            }}
          >
            <span className="week-view__timed-event-title">{event.title}</span>
            <span className="week-view__timed-event-time">{formatEventTime(event.start)}</span>
          </button>
        )
      })}
      {draftSegment && (
        <div
          className="week-view__timed-event week-view__event--blue week-view__timed-event--draft"
          ref={draftChipRef}
          style={{ top: `${draftSegment.top}px`, height: `${draftSegment.height}px` }}
          aria-hidden="true"
        >
          <span className="week-view__timed-event-title">(No title)</span>
          <span className="week-view__timed-event-time">{formatDraftTime(draftEvent.start)}–{formatDraftTime(draftEvent.end)}</span>
        </div>
      )}
    </div>
  )
}

export default TimeGridDayColumn

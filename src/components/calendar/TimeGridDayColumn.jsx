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

function TimeGridDayColumn({ area = 'timed', currentDate, currentTimeTop, date, events, onSelectEvent, selectedEventChipId }) {
  const isPastDate = compareDates(date, currentDate) < 0

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
              onClick={(clickEvent) => onSelectEvent(event, clickEvent.currentTarget, eventChipId)}
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

  return (
    <div className="week-view__day-column" role="gridcell">
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
            onClick={(clickEvent) => onSelectEvent(event, clickEvent.currentTarget, eventChipId)}
          >
            <span className="week-view__timed-event-title">{event.title}</span>
            <span className="week-view__timed-event-time">{formatEventTime(event.start)}</span>
          </button>
        )
      })}
    </div>
  )
}

export default TimeGridDayColumn

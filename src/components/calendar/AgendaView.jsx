import {
  addDays,
  addMonths,
  isDateInRange,
  isSameDay,
  parseLocalDate,
  startOfDay,
  toDateKey,
} from '../../utils/dateHelpers.js'
import '../../styles/agenda-view.css'

const MONTH_FORMATTER = new Intl.DateTimeFormat('en-US', { month: 'short' })
const WEEKDAY_FORMATTER = new Intl.DateTimeFormat('en-US', { weekday: 'short' })
const TIME_FORMATTER = new Intl.DateTimeFormat('en-US', {
  hour: 'numeric',
  minute: '2-digit',
})

function getAgendaRange(displayDate) {
  const start = startOfDay(displayDate)
  const end = addDays(addMonths(start, 6), -1)

  return { end, start }
}

function getOccurrenceTime(event, date) {
  if (event.allDay) return 'All day'

  return isSameDay(event.start, date)
    ? TIME_FORMATTER.format(parseLocalDate(event.start))
    : 'Continues'
}

function getEventOccurrenceTime(event, date) {
  if (event.allDay) return -1

  const eventStart = parseLocalDate(event.start)

  return isSameDay(eventStart, date)
    ? eventStart.getTime()
    : startOfDay(date).getTime()
}

function getDateGroups(displayDate, events) {
  const { end, start } = getAgendaRange(displayDate)
  const groups = []

  for (let date = start; date <= end; date = addDays(date, 1)) {
    const eventsForDate = events
      .filter((event) => isDateInRange(date, event.start, event.end))
      .sort((left, right) => {
        if (left.allDay !== right.allDay) return left.allDay ? -1 : 1

        return getEventOccurrenceTime(left, date) - getEventOccurrenceTime(right, date)
      })

    if (eventsForDate.length) {
      groups.push({ date, events: eventsForDate })
    }
  }

  return groups
}

function AgendaView({ displayDate, events }) {
  const dateGroups = getDateGroups(displayDate, events)

  return (
    <section className="agenda-view" aria-label="Agenda">
      {dateGroups.length ? (
        <div className="agenda-view__groups">
          {dateGroups.map(({ date, events: eventsForDate }) => {
            const dateKey = toDateKey(date)
            const dateLabel = date.toLocaleDateString('en-US', {
              day: 'numeric',
              month: 'long',
              weekday: 'long',
              year: 'numeric',
            })

            return (
              <section className="agenda-view__date-group" aria-labelledby={`agenda-date-${dateKey}`} key={dateKey}>
                <header className="agenda-view__date-header" id={`agenda-date-${dateKey}`}>
                  <time className="agenda-view__date" dateTime={dateKey} aria-label={dateLabel}>
                    <span className="agenda-view__day-number">{date.getDate()}</span>
                    <span className="agenda-view__month">{MONTH_FORMATTER.format(date)}</span>
                    <span className="agenda-view__weekday">{WEEKDAY_FORMATTER.format(date)}</span>
                  </time>
                </header>

                <div className="agenda-view__events">
                  {eventsForDate.map((event) => (
                    <article className="agenda-view__event" key={`${event.id}-${dateKey}`}>
                      <span className={`agenda-view__event-marker agenda-view__event-marker--${event.color}`} aria-hidden="true" />
                      <time className="agenda-view__event-time" dateTime={event.start}>
                        {getOccurrenceTime(event, date)}
                      </time>
                      <span className="agenda-view__event-title">{event.title}</span>
                    </article>
                  ))}
                </div>
              </section>
            )
          })}
        </div>
      ) : (
        <div className="agenda-view__empty" role="status">
          No events in this period.
        </div>
      )}
    </section>
  )
}

export default AgendaView

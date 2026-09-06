import { useEffect, useState } from 'react'
import mockEvents from '../../data/mockEvents.js'
import {
  addDays,
  compareDates,
  getStartOfWeek,
  isDateInRange,
  isSameDay,
  parseLocalDate,
  startOfDay,
} from '../../utils/dateHelpers.js'
import '../../styles/week-view.css'

const HOUR_HEIGHT = 56
const HOURS = Array.from({ length: 24 }, (_, hour) => hour)

function formatHour(hour) {
  if (hour === 0) return '12 AM'
  if (hour === 12) return '12 PM'

  return `${hour % 12} ${hour < 12 ? 'AM' : 'PM'}`
}

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

function WeekView({ displayDate }) {
  const weekStart = getStartOfWeek(displayDate)
  const weekDates = Array.from({ length: 7 }, (_, index) => addDays(weekStart, index))
  const [currentDate, setCurrentDate] = useState(() => new Date())
  const currentTimeTop = (currentDate.getHours() + (currentDate.getMinutes() / 60)) * HOUR_HEIGHT

  useEffect(() => {
    const timer = window.setInterval(() => setCurrentDate(new Date()), 60_000)

    return () => window.clearInterval(timer)
  }, [])

  return (
    <section className="week-view" aria-label="Weekly calendar">
      <div className="week-view__content">
        <div className="week-view__day-headers" role="row">
          <div className="week-view__time-gutter week-view__time-gutter--header" aria-hidden="true" />
          {weekDates.map((date) => {
            const today = isSameDay(date, currentDate)

            return (
              <div
                className={`week-view__day-header${today ? ' week-view__day-header--today' : ''}`}
                role="columnheader"
                key={date.toISOString()}
              >
                <span className="week-view__weekday">{date.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                <span className="week-view__date" aria-current={today ? 'date' : undefined}>{date.getDate()}</span>
              </div>
            )
          })}
        </div>

        <div className="week-view__all-day-row">
          <div className="week-view__all-day-label">all-day</div>
          <div className="week-view__all-day-days">
            {weekDates.map((date) => {
              const allDayEvents = mockEvents.filter((event) => event.allDay && isDateInRange(date, event.start, event.end))
              const isPastDate = compareDates(date, currentDate) < 0

              return (
                <div className="week-view__all-day-cell" key={date.toISOString()}>
                  {allDayEvents.map((event) => (
                    <div
                      className={`week-view__all-day-event week-view__event--${event.color}${isPastDate ? ' week-view__event--past' : ''}`}
                      title={event.title}
                      key={`${event.id}-${date.toISOString()}`}
                    >
                      {event.title}
                    </div>
                  ))}
                </div>
              )
            })}
          </div>
        </div>

        <div className="week-view__scroll">
          <div className="week-view__timeline" role="grid" aria-label="Hourly week schedule">
            <div className="week-view__time-labels" aria-hidden="true">
              {HOURS.map((hour) => <span className="week-view__time-label" key={hour}>{formatHour(hour)}</span>)}
            </div>
            <div className="week-view__day-columns">
              {weekDates.map((date) => {
                const today = isSameDay(date, currentDate)
                const isPastDate = compareDates(date, currentDate) < 0
                const timedEvents = mockEvents
                  .filter((event) => !event.allDay)
                  .map((event) => ({ event, segment: getTimedEventSegment(event, date) }))
                  .filter(({ segment }) => segment)

                return (
                  <div className="week-view__day-column" role="gridcell" key={date.toISOString()}>
                    {today && (
                      <div
                        className="week-view__current-time"
                        style={{ top: `${currentTimeTop}px` }}
                        aria-label={`Current time ${formatEventTime(currentDate)}`}
                      >
                        <span className="week-view__current-time-dot" aria-hidden="true" />
                      </div>
                    )}
                    {timedEvents.map(({ event, segment }) => (
                      <div
                        className={`week-view__timed-event week-view__event--${event.color}${isPastDate ? ' week-view__event--past' : ''}`}
                        style={{ top: `${segment.top}px`, height: `${segment.height}px` }}
                        title={`${event.title}, ${formatEventTime(event.start)}`}
                        key={event.id}
                      >
                        <span className="week-view__timed-event-title">{event.title}</span>
                        <span className="week-view__timed-event-time">{formatEventTime(event.start)}</span>
                      </div>
                    ))}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default WeekView

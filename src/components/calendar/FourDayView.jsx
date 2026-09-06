import { useEffect, useState } from 'react'
import { addDays, isSameDay } from '../../utils/dateHelpers.js'
import TimeGridDayColumn from './TimeGridDayColumn.jsx'
import '../../styles/week-view.css'
import '../../styles/four-day-view.css'

const HOUR_HEIGHT = 56
const HOURS = Array.from({ length: 24 }, (_, hour) => hour)

function formatHour(hour) {
  if (hour === 0) return '12 AM'
  if (hour === 12) return '12 PM'

  return `${hour % 12} ${hour < 12 ? 'AM' : 'PM'}`
}

function FourDayView({ displayDate, draftEvent, events, onDraftAnchor, onSelectEvent, onSelectTime, selectedEventChipId }) {
  const dates = Array.from({ length: 4 }, (_, index) => addDays(displayDate, index))
  const [currentDate, setCurrentDate] = useState(() => new Date())
  const currentTimeTop = (currentDate.getHours() + (currentDate.getMinutes() / 60)) * HOUR_HEIGHT

  useEffect(() => {
    const timer = window.setInterval(() => setCurrentDate(new Date()), 60_000)

    return () => window.clearInterval(timer)
  }, [])

  return (
    <section className="four-day-view" aria-label="Four-day calendar">
      <div className="four-day-view__content">
        <div className="four-day-view__day-headers" role="row">
          <div className="week-view__time-gutter four-day-view__time-gutter" aria-hidden="true" />
          {dates.map((date) => {
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

        <div className="four-day-view__all-day-row">
          <div className="week-view__all-day-label">all-day</div>
          <div className="four-day-view__all-day-days">
            {dates.map((date) => (
              <TimeGridDayColumn area="all-day" currentDate={currentDate} date={date} events={events} key={date.toISOString()} onSelectEvent={onSelectEvent} selectedEventChipId={selectedEventChipId} />
            ))}
          </div>
        </div>

        <div className="four-day-view__scroll">
          <div className="four-day-view__timeline" role="grid" aria-label="Hourly four-day schedule">
            <div className="week-view__time-labels" aria-hidden="true">
              {HOURS.map((hour) => <span className="week-view__time-label" key={hour}>{formatHour(hour)}</span>)}
            </div>
            <div className="four-day-view__day-columns">
              {dates.map((date) => (
                <TimeGridDayColumn
                  currentDate={currentDate}
                  currentTimeTop={currentTimeTop}
                  date={date}
                  draftEvent={draftEvent}
                  events={events}
                  key={date.toISOString()}
                  onDraftAnchor={onDraftAnchor}
                  onSelectEvent={onSelectEvent}
                  onSelectTime={onSelectTime}
                  selectedEventChipId={selectedEventChipId}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FourDayView

import { useEffect, useState } from 'react'
import {
  addDays,
  getStartOfWeek,
  isSameDay,
} from '../../utils/dateHelpers.js'
import TimeGridDayColumn from './TimeGridDayColumn.jsx'
import '../../styles/week-view.css'

const HOUR_HEIGHT = 56
const HOURS = Array.from({ length: 24 }, (_, hour) => hour)

function formatHour(hour) {
  if (hour === 0) return '12 AM'
  if (hour === 12) return '12 PM'

  return `${hour % 12} ${hour < 12 ? 'AM' : 'PM'}`
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
            {weekDates.map((date) => <TimeGridDayColumn area="all-day" currentDate={currentDate} date={date} key={date.toISOString()} />)}
          </div>
        </div>

        <div className="week-view__scroll">
          <div className="week-view__timeline" role="grid" aria-label="Hourly week schedule">
            <div className="week-view__time-labels" aria-hidden="true">
              {HOURS.map((hour) => <span className="week-view__time-label" key={hour}>{formatHour(hour)}</span>)}
            </div>
            <div className="week-view__day-columns">
              {weekDates.map((date) => (
                <TimeGridDayColumn
                  currentDate={currentDate}
                  currentTimeTop={currentTimeTop}
                  date={date}
                  key={date.toISOString()}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default WeekView

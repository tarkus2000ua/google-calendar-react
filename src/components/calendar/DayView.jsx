import { useEffect, useState } from 'react'
import { isSameDay } from '../../utils/dateHelpers.js'
import TimeGridDayColumn from './TimeGridDayColumn.jsx'
import '../../styles/day-view.css'

const HOUR_HEIGHT = 56
const HOURS = Array.from({ length: 24 }, (_, hour) => hour)

function formatTimeZone(date) {
  const offset = -date.getTimezoneOffset()
  const sign = offset >= 0 ? '+' : '-'
  const hours = String(Math.floor(Math.abs(offset) / 60)).padStart(2, '0')

  return `GMT${sign}${hours}`
}

function formatHour(hour) {
  if (hour === 0) return '12 AM'
  if (hour === 12) return '12 PM'

  return `${hour % 12} ${hour < 12 ? 'AM' : 'PM'}`
}

function DayView({ displayDate }) {
  const [currentDate, setCurrentDate] = useState(() => new Date())
  const currentTimeTop = (currentDate.getHours() + (currentDate.getMinutes() / 60)) * HOUR_HEIGHT
  const today = isSameDay(displayDate, currentDate)

  useEffect(() => {
    const timer = window.setInterval(() => setCurrentDate(new Date()), 60_000)

    return () => window.clearInterval(timer)
  }, [])

  return (
    <section className="day-view" aria-label="Daily calendar">
      <div className="day-view__content">
        <div className="day-view__day-headers" role="row">
          <div className="week-view__time-gutter day-view__time-zone">{formatTimeZone(displayDate)}</div>
          <div className={`day-view__day-header${today ? ' day-view__day-header--today' : ''}`} role="columnheader">
            <span className="day-view__weekday">{displayDate.toLocaleDateString('en-US', { weekday: 'short' })}</span>
            <span className="day-view__date" aria-current={today ? 'date' : undefined}>{displayDate.getDate()}</span>
          </div>
        </div>

        <div className="day-view__all-day-row">
          <div className="week-view__all-day-label">all-day</div>
          <div className="day-view__all-day-days">
            <TimeGridDayColumn area="all-day" currentDate={currentDate} date={displayDate} />
          </div>
        </div>

        <div className="day-view__scroll">
          <div className="day-view__timeline" role="grid" aria-label="Hourly day schedule">
            <div className="week-view__time-labels" aria-hidden="true">
              {HOURS.map((hour) => <span className="week-view__time-label" key={hour}>{formatHour(hour)}</span>)}
            </div>
            <div className="day-view__day-columns">
              <TimeGridDayColumn currentDate={currentDate} currentTimeTop={currentTimeTop} date={displayDate} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default DayView

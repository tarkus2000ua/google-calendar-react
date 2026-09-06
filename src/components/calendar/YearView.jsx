import {
  addDays,
  formatMonthYear,
  getStartOfWeek,
  isDateInRange,
  isSameDay,
  isSameMonth,
  isToday,
  toDateKey,
} from '../../utils/dateHelpers.js'
import '../../styles/year-view.css'

const WEEKDAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

function getMonthDates(month) {
  const gridStart = getStartOfWeek(month)

  return Array.from({ length: 42 }, (_, index) => addDays(gridStart, index))
}

function getEventColors(events, date) {
  return [...new Set(
    events
      .filter((event) => isDateInRange(date, event.start, event.end))
      .map((event) => event.color),
  )]
}

function getDateLabel(date, eventCount) {
  const dateLabel = date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    weekday: 'long',
    year: 'numeric',
  })

  if (!eventCount) return `Open ${dateLabel} in month view`

  return `Open ${dateLabel} in month view, ${eventCount} ${eventCount === 1 ? 'event' : 'events'}`
}

function YearView({ displayDate, events, onSelectDate, selectedDate }) {
  const year = displayDate.getFullYear()
  const months = Array.from({ length: 12 }, (_, index) => new Date(year, index, 1))

  return (
    <section className="year-view" aria-label={`${year} calendar`}>
      <div className="year-view__grid">
        {months.map((month) => (
          <section className="year-view__month" aria-labelledby={`year-month-${toDateKey(month)}`} key={month.getMonth()}>
            <h2 className="year-view__month-title" id={`year-month-${toDateKey(month)}`}>{formatMonthYear(month, 'en-US').replace(` ${year}`, '')}</h2>
            <div className="year-view__weekdays" aria-hidden="true">
              {WEEKDAY_LABELS.map((weekday, index) => <span key={`${weekday}-${index}`}>{weekday}</span>)}
            </div>
            <div className="year-view__days" role="grid" aria-label={`${formatMonthYear(month)} calendar`}>
              {getMonthDates(month).map((date) => {
                const isCurrentMonth = isSameMonth(date, month)

                if (!isCurrentMonth) {
                  return <span aria-hidden="true" className="year-view__day-placeholder" key={date.toISOString()} />
                }

                const eventColors = getEventColors(events, date)
                const eventCount = events.filter((event) => isDateInRange(date, event.start, event.end)).length
                const selected = selectedDate && isSameDay(date, selectedDate)
                const today = isToday(date)

                return (
                  <button
                    aria-current={today ? 'date' : undefined}
                    aria-label={getDateLabel(date, eventCount)}
                    className={`year-view__day${today ? ' year-view__day--today' : ''}${selected ? ' year-view__day--selected' : ''}`}
                    key={date.toISOString()}
                    data-year-date="true"
                    onClick={(clickEvent) => onSelectDate(date, clickEvent.currentTarget)}
                    role="gridcell"
                    type="button"
                  >
                    <span className="year-view__day-number">{date.getDate()}</span>
                    {eventColors.length > 0 && (
                      <span className="year-view__event-markers" aria-hidden="true">
                        {eventColors.slice(0, 3).map((color) => <span className={`year-view__event-marker year-view__event-marker--${color}`} key={color} />)}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </section>
        ))}
      </div>
    </section>
  )
}

export default YearView

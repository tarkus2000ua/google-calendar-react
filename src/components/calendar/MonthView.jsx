import mockEvents from '../../data/mockEvents.js'
import {
  compareDates,
  formatMonthYear,
  getMonthGridDates,
  isDateInRange,
  isSameMonth,
  parseLocalDate,
} from '../../utils/dateHelpers.js'
import '../../styles/month-view.css'

const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function formatEventTime(value) {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(parseLocalDate(value))
}

function MonthView({ displayMonth }) {
  const gridDates = getMonthGridDates(displayMonth)
  const monthLabel = formatMonthYear(displayMonth)
  const currentDate = new Date()

  return (
    <section className="month-view" aria-label={monthLabel}>
      <div className="month-view__weekdays" role="row">
        {WEEKDAY_LABELS.map((weekday) => (
          <div className="month-view__weekday" role="columnheader" key={weekday}>
            {weekday}
          </div>
        ))}
      </div>

      <div className="month-view__grid" role="grid" aria-label={`${monthLabel} calendar`}>
        {gridDates.map((date) => {
          const eventsForDate = mockEvents.filter((event) => isDateInRange(date, event.start, event.end))
          const isCurrentMonth = isSameMonth(date, displayMonth)
          const dayComparison = compareDates(date, currentDate)
          const today = dayComparison === 0
          const isPastDate = dayComparison < 0

          return (
            <div
              className={`month-view__day${isCurrentMonth ? '' : ' month-view__day--outside'}${today ? ' month-view__day--today' : ''}`}
              role="gridcell"
              aria-label={date.toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
              key={date.toISOString()}
            >
              <div className="month-view__date-number">{date.getDate()}</div>
              <div className="month-view__events">
                {eventsForDate.map((event) => (
                  <div
                    className={`month-view__event month-view__event--${event.color}${isPastDate ? ' month-view__event--past' : ''}`}
                    key={event.id}
                    title={event.title}
                  >
                    {!event.allDay && <span className="month-view__event-time">{formatEventTime(event.start)}</span>}
                    <span className="month-view__event-title">{event.title}</span>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default MonthView

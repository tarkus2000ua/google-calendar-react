import mockEvents from '../../data/mockEvents.js'
import {
  getMonthGridDates,
  isDateInRange,
  isSameMonth,
  isToday,
  parseLocalDate,
} from '../../utils/dateHelpers.js'
import '../../styles/month-view.css'

const DISPLAY_MONTH = new Date(2026, 8, 1)
const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function formatEventTime(value) {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(parseLocalDate(value))
}

function MonthView() {
  const gridDates = getMonthGridDates(DISPLAY_MONTH)

  return (
    <section className="month-view" aria-label="September 2026">
      <div className="month-view__weekdays" role="row">
        {WEEKDAY_LABELS.map((weekday) => (
          <div className="month-view__weekday" role="columnheader" key={weekday}>
            {weekday}
          </div>
        ))}
      </div>

      <div className="month-view__grid" role="grid" aria-label="September 2026 calendar">
        {gridDates.map((date) => {
          const eventsForDate = mockEvents.filter((event) => isDateInRange(date, event.start, event.end))
          const isCurrentMonth = isSameMonth(date, DISPLAY_MONTH)
          const today = isToday(date)

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
                    className={`month-view__event month-view__event--${event.color}`}
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

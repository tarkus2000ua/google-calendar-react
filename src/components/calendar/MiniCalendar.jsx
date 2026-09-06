import {
  formatMonthYear,
  getMonthGridDates,
  isSameMonth,
  isSameDay,
  isToday,
} from '../../utils/dateHelpers.js'
import IconButton from '../ui/IconButton.jsx'
import '../../styles/mini-calendar.css'

const WEEKDAYS = [
  { label: 'S', name: 'Sunday' },
  { label: 'M', name: 'Monday' },
  { label: 'T', name: 'Tuesday' },
  { label: 'W', name: 'Wednesday' },
  { label: 'T', name: 'Thursday' },
  { label: 'F', name: 'Friday' },
  { label: 'S', name: 'Saturday' },
]

function MiniCalendar({ displayMonth, selectedDate, onPreviousMonth, onNextMonth, onSelectDate }) {
  const monthLabel = formatMonthYear(displayMonth)
  const gridDates = getMonthGridDates(displayMonth)

  return (
    <div className="mini-calendar" aria-label={`${monthLabel} mini calendar`}>
      <div className="mini-calendar__header">
        <p className="mini-calendar__month-label">{monthLabel}</p>
        <div className="mini-calendar__navigation" aria-label="Mini calendar navigation">
          <IconButton ariaLabel="Previous month" icon="chevron-left" onClick={onPreviousMonth} />
          <IconButton ariaLabel="Next month" icon="chevron-right" onClick={onNextMonth} />
        </div>
      </div>

      <div className="mini-calendar__weekdays" role="row">
        {WEEKDAYS.map((weekday) => (
          <div className="mini-calendar__weekday" role="columnheader" key={weekday.name}>
            {weekday.label}
          </div>
        ))}
      </div>

      <div className="mini-calendar__grid" role="grid" aria-label={`${monthLabel} calendar`}>
        {gridDates.map((date) => {
          const currentMonth = isSameMonth(date, displayMonth)
          const today = isToday(date)
          const selected = selectedDate ? isSameDay(date, selectedDate) : false

          return (
            <div
              className="mini-calendar__day"
              role="gridcell"
              key={date.toISOString()}
            >
              <button
                className={`mini-calendar__date${currentMonth ? '' : ' mini-calendar__date--outside'}${today ? ' mini-calendar__date--today' : ''}${selected ? ' mini-calendar__date--selected' : ''}`}
                type="button"
                aria-current={today ? 'date' : undefined}
                aria-label={date.toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
                aria-pressed={selected}
                onClick={() => onSelectDate(date)}
              >
                {date.getDate()}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default MiniCalendar

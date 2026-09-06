import { useLayoutEffect, useRef } from 'react'
import EventChip from './EventChip.jsx'
import {
  compareDates,
  formatMonthYear,
  getMonthGridDates,
  isDateInRange,
  isWeekend,
  isSameDay,
  isSameMonth,
  toDateKey,
} from '../../utils/dateHelpers.js'
import '../../styles/month-view.css'

const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function formatDraftTime(value) {
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    hour12: false,
    minute: '2-digit',
  }).format(value)
}

function MonthView({ displayMonth, draftEvent, events, onDraftAnchor, onSelectDate, onSelectEvent, selectedDate, selectedEventChipId, showWeekends }) {
  const gridDates = getMonthGridDates(displayMonth).filter((date) => showWeekends || !isWeekend(date))
  const monthLabel = formatMonthYear(displayMonth)
  const currentDate = new Date()
  const draftChipRef = useRef(null)

  useLayoutEffect(() => {
    if (draftEvent && draftChipRef.current) {
      onDraftAnchor(draftChipRef.current)
    }
  }, [draftEvent, onDraftAnchor])

  return (
    <section className={`month-view${showWeekends ? '' : ' month-view--hide-weekends'}`} aria-label={monthLabel}>
      <div className="month-view__weekdays" role="row">
        {WEEKDAY_LABELS.filter((_, index) => showWeekends || (index !== 0 && index !== 6)).map((weekday) => (
          <div className="month-view__weekday" role="columnheader" key={weekday}>
            {weekday}
          </div>
        ))}
      </div>

      <div className="month-view__grid" role="grid" aria-label={`${monthLabel} calendar`}>
        {gridDates.map((date) => {
          const eventsForDate = events.filter((event) => isDateInRange(date, event.start, event.end))
          const isCurrentMonth = isSameMonth(date, displayMonth)
          const dayComparison = compareDates(date, currentDate)
          const today = dayComparison === 0
          const isPastDate = dayComparison < 0
          const isSelectedDay = selectedDate ? isSameDay(date, selectedDate) : false
          const isDraftDate = draftEvent ? isSameDay(date, draftEvent.date) : false

          return (
            <div
              className={`month-view__day${isCurrentMonth ? '' : ' month-view__day--outside'}${today ? ' month-view__day--today' : ''}${isSelectedDay ? ' month-view__day--selected' : ''}`}
              role="gridcell"
              aria-label={date.toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
              key={date.toISOString()}
              onClick={(event) => onSelectDate(date, event.currentTarget)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  onSelectDate(date, event.currentTarget)
                }
              }}
              tabIndex={0}
            >
              <div className="month-view__date-number">{date.getDate()}</div>
              <div className="month-view__events">
                {eventsForDate.map((event) => (
                  <EventChip
                    event={event}
                    eventChipId={`${event.id}-${toDateKey(date)}`}
                    isPast={isPastDate}
                    isSelected={selectedEventChipId === `${event.id}-${toDateKey(date)}`}
                    key={event.id}
                    onSelectEvent={onSelectEvent}
                  />
                ))}
                {isDraftDate && (
                  <div className="month-view__event month-view__event--blue month-view__event--draft" ref={draftChipRef} aria-hidden="true">
                    {draftEvent.displayTime && <span className="month-view__event-time">{formatDraftTime(draftEvent.start)}</span>}
                    <span className="month-view__event-title">(No title)</span>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default MonthView

import MonthView from '../calendar/MonthView.jsx'
import WeekView from '../calendar/WeekView.jsx'
import DayView from '../calendar/DayView.jsx'

const VIEW_LABELS = {
  day: 'Day',
  week: 'Week',
  year: 'Year',
  schedule: 'Schedule',
  'four-days': '4 days',
}

function CalendarPlaceholder({ activeView }) {
  const viewLabel = VIEW_LABELS[activeView]

  return (
    <section className="calendar-placeholder" aria-labelledby="calendar-placeholder-title">
      <div className="calendar-placeholder__content">
        <p className="calendar-placeholder__eyebrow">Calendar view</p>
        <h1 className="calendar-placeholder__title" id="calendar-placeholder-title">{viewLabel}</h1>
        <p className="calendar-placeholder__message">
          The {viewLabel.toLowerCase()} view is a UI-only placeholder for now.
        </p>
      </div>
    </section>
  )
}

function CalendarCanvas({ activeView, displayDate, displayMonth }) {
  return (
    <main className="calendar-canvas" aria-label="Calendar workspace">
      <div className="calendar-canvas__surface">
        {activeView === 'month' && <MonthView displayMonth={displayMonth} />}
        {activeView === 'week' && <WeekView displayDate={displayDate} />}
        {activeView === 'day' && <DayView displayDate={displayDate} />}
        {activeView !== 'month' && activeView !== 'week' && activeView !== 'day' && <CalendarPlaceholder activeView={activeView} />}
      </div>
    </main>
  )
}

export default CalendarCanvas

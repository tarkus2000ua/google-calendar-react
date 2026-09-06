import MonthView from '../calendar/MonthView.jsx'
import WeekView from '../calendar/WeekView.jsx'
import DayView from '../calendar/DayView.jsx'
import AgendaView from '../calendar/AgendaView.jsx'
import mockEvents from '../../data/mockEvents.js'

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

function CalendarCanvas({ activeView, displayDate, displayMonth, visibleCalendars }) {
  const events = mockEvents.filter((event) => visibleCalendars.includes(event.calendar))

  return (
    <main className="calendar-canvas" aria-label="Calendar workspace">
      <div className="calendar-canvas__surface">
        {activeView === 'month' && <MonthView displayMonth={displayMonth} events={events} />}
        {activeView === 'week' && <WeekView displayDate={displayDate} events={events} />}
        {activeView === 'day' && <DayView displayDate={displayDate} events={events} />}
        {activeView === 'schedule' && <AgendaView displayDate={displayDate} events={events} />}
        {activeView !== 'month' && activeView !== 'week' && activeView !== 'day' && activeView !== 'schedule' && <CalendarPlaceholder activeView={activeView} />}
      </div>
    </main>
  )
}

export default CalendarCanvas

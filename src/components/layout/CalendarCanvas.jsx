import MonthView from '../calendar/MonthView.jsx'
import WeekView from '../calendar/WeekView.jsx'
import FourDayView from '../calendar/FourDayView.jsx'
import DayView from '../calendar/DayView.jsx'
import AgendaView from '../calendar/AgendaView.jsx'
import YearView from '../calendar/YearView.jsx'

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

function CalendarCanvas({ activeView, displayDate, displayMonth, draftEvent, events, onDraftAnchor, onSelectDate, onSelectEvent, onSelectTime, onSelectYearDate, selectedDate, selectedEventChipId, showWeekends }) {
  return (
    <main className="calendar-canvas" aria-label="Calendar workspace">
      <div className="calendar-canvas__surface">
        {activeView === 'month' && <MonthView displayMonth={displayMonth} draftEvent={draftEvent} events={events} onDraftAnchor={onDraftAnchor} onSelectDate={onSelectDate} onSelectEvent={onSelectEvent} selectedDate={selectedDate} selectedEventChipId={selectedEventChipId} showWeekends={showWeekends} />}
        {activeView === 'week' && <WeekView displayDate={displayDate} draftEvent={draftEvent} events={events} onDraftAnchor={onDraftAnchor} onSelectEvent={onSelectEvent} onSelectTime={onSelectTime} selectedEventChipId={selectedEventChipId} showWeekends={showWeekends} />}
        {activeView === 'four-days' && <FourDayView displayDate={displayDate} draftEvent={draftEvent} events={events} onDraftAnchor={onDraftAnchor} onSelectEvent={onSelectEvent} onSelectTime={onSelectTime} selectedEventChipId={selectedEventChipId} />}
        {activeView === 'day' && <DayView displayDate={displayDate} draftEvent={draftEvent} events={events} onDraftAnchor={onDraftAnchor} onSelectEvent={onSelectEvent} onSelectTime={onSelectTime} selectedEventChipId={selectedEventChipId} />}
        {activeView === 'schedule' && <AgendaView displayDate={displayDate} events={events} onSelectEvent={onSelectEvent} selectedEventChipId={selectedEventChipId} />}
        {activeView === 'year' && <YearView displayDate={displayDate} events={events} onSelectDate={onSelectYearDate} selectedDate={selectedDate} />}
        {activeView !== 'month' && activeView !== 'week' && activeView !== 'four-days' && activeView !== 'day' && activeView !== 'schedule' && activeView !== 'year' && <CalendarPlaceholder activeView={activeView} />}
      </div>
    </main>
  )
}

export default CalendarCanvas

import MonthView from '../calendar/MonthView.jsx'

function CalendarCanvas({ displayMonth }) {
  return (
    <main className="calendar-canvas" aria-label="Calendar workspace">
      <div className="calendar-canvas__surface">
        <MonthView displayMonth={displayMonth} />
      </div>
    </main>
  )
}

export default CalendarCanvas

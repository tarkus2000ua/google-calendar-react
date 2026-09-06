import MonthView from '../calendar/MonthView.jsx'

function CalendarCanvas() {
  return (
    <main className="calendar-canvas" aria-label="Calendar workspace">
      <div className="calendar-canvas__surface">
        <MonthView />
      </div>
    </main>
  )
}

export default CalendarCanvas

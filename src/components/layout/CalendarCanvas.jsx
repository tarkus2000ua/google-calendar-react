import MonthView from '../calendar/MonthView.jsx'

function CalendarPlaceholder({ activeView }) {
  const viewLabel = `${activeView.charAt(0).toUpperCase()}${activeView.slice(1)}`

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

function CalendarCanvas({ activeView, displayMonth }) {
  return (
    <main className="calendar-canvas" aria-label="Calendar workspace">
      <div className="calendar-canvas__surface">
        {activeView === 'month' ? <MonthView displayMonth={displayMonth} /> : <CalendarPlaceholder activeView={activeView} />}
      </div>
    </main>
  )
}

export default CalendarCanvas

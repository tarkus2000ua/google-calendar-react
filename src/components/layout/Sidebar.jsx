import SidebarSection from './SidebarSection.jsx'
import MiniCalendar from '../calendar/MiniCalendar.jsx'

function Sidebar({ displayMonth, selectedDate, onPreviousMonth, onNextMonth, onSelectDate }) {
  return (
    <aside className="sidebar" aria-label="Calendar sidebar">
      <button className="create-button" type="button">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 5v14M5 12h14" />
        </svg>
        Create
      </button>

      <section className="sidebar-section" aria-label="Mini calendar">
        <MiniCalendar
          displayMonth={displayMonth}
          selectedDate={selectedDate}
          onPreviousMonth={onPreviousMonth}
          onNextMonth={onNextMonth}
          onSelectDate={onSelectDate}
        />
      </section>

      <SidebarSection heading="My calendars" headingId="my-calendars-heading">
        <div className="sidebar-placeholder sidebar-placeholder--list" aria-hidden="true" />
      </SidebarSection>
    </aside>
  )
}

export default Sidebar

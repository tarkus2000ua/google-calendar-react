import SidebarSection from './SidebarSection.jsx'

function Sidebar() {
  return (
    <aside className="sidebar" aria-label="Calendar sidebar">
      <button className="create-button" type="button">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 5v14M5 12h14" />
        </svg>
        Create
      </button>

      <SidebarSection heading="Mini calendar" headingId="mini-calendar-heading">
        <div className="sidebar-placeholder sidebar-placeholder--calendar" aria-hidden="true" />
      </SidebarSection>

      <SidebarSection heading="My calendars" headingId="my-calendars-heading">
        <div className="sidebar-placeholder sidebar-placeholder--list" aria-hidden="true" />
      </SidebarSection>
    </aside>
  )
}

export default Sidebar

function Sidebar() {
  return (
    <aside className="sidebar" aria-label="Calendar sidebar">
      <button className="create-button" type="button">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 5v14M5 12h14" />
        </svg>
        Create
      </button>

      <section className="sidebar-section" aria-labelledby="mini-calendar-heading">
        <h2 id="mini-calendar-heading">Mini calendar</h2>
        <div className="sidebar-placeholder sidebar-placeholder--calendar" aria-hidden="true" />
      </section>

      <section className="sidebar-section" aria-labelledby="my-calendars-heading">
        <h2 id="my-calendars-heading">My calendars</h2>
        <div className="sidebar-placeholder sidebar-placeholder--list" aria-hidden="true" />
      </section>
    </aside>
  )
}

export default Sidebar

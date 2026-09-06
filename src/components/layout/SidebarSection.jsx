function SidebarSection({ children, controls, heading, headingId }) {
  return (
    <section className="sidebar-section" aria-labelledby={headingId}>
      <div className="sidebar-section__header">
        <h2 id={headingId}>{heading}</h2>
        {controls && (
          <div className="sidebar-section__controls" aria-hidden="true">
            {controls}
          </div>
        )}
      </div>
      {children}
    </section>
  )
}

export default SidebarSection

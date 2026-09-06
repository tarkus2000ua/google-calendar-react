function SidebarSection({ children, heading, headingId }) {
  return (
    <section className="sidebar-section" aria-labelledby={headingId}>
      <h2 id={headingId}>{heading}</h2>
      {children}
    </section>
  )
}

export default SidebarSection

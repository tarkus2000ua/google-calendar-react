import { useEffect, useRef, useState } from 'react'
import SidebarSection from './SidebarSection.jsx'
import MiniCalendar from '../calendar/MiniCalendar.jsx'
import icons from '../ui/icons.jsx'

const MY_CALENDARS = [
  { color: 'work', name: 'Work' },
  { color: 'personal', name: 'Personal' },
]

const OTHER_CALENDARS = [
  { color: 'holidays', name: 'Holidays' },
]

const CREATE_TYPES = [
  { label: 'Event', value: 'event' },
  { label: 'Task', value: 'task' },
  { label: 'Appointment schedule', value: 'appointment' },
]

function CalendarList({ calendars, onToggleCalendar, visibleCalendars }) {
  return (
    <ul className="calendar-list">
      {calendars.map((calendar) => {
        const isVisible = visibleCalendars.includes(calendar.name)

        return (
          <li key={calendar.name}>
            <button
              className="calendar-list__item"
              type="button"
              aria-pressed={isVisible}
              onClick={() => onToggleCalendar(calendar.name)}
            >
              <span
                className={`calendar-list__indicator calendar-list__indicator--${calendar.color}${isVisible ? '' : ' calendar-list__indicator--unchecked'}`}
                aria-hidden="true"
              >
                {isVisible ? '✓' : ''}
              </span>
              <span>{calendar.name}</span>
            </button>
          </li>
        )
      })}
    </ul>
  )
}

function SectionControl({ icon }) {
  return <span className="sidebar-section__control">{icons[icon]}</span>
}

function Sidebar({
  displayMonth,
  selectedDate,
  onPreviousMonth,
  onNextMonth,
  onSelectDate,
  onToggleCalendar,
  visibleCalendars,
  onCreate,
}) {
  const [isCreateMenuOpen, setIsCreateMenuOpen] = useState(false)
  const createControlRef = useRef(null)
  const createButtonRef = useRef(null)

  useEffect(() => {
    if (!isCreateMenuOpen) return undefined

    function closeOnOutsidePointer(event) {
      if (!createControlRef.current?.contains(event.target)) {
        setIsCreateMenuOpen(false)
      }
    }

    document.addEventListener('pointerdown', closeOnOutsidePointer)

    return () => document.removeEventListener('pointerdown', closeOnOutsidePointer)
  }, [isCreateMenuOpen])

  function selectCreateType(type) {
    setIsCreateMenuOpen(false)
    onCreate(createButtonRef.current, type)
  }

  function handleCreateKeyDown(event) {
    if (event.key !== 'Escape' || !isCreateMenuOpen) return

    event.preventDefault()
    setIsCreateMenuOpen(false)
    createButtonRef.current?.focus()
  }

  return (
    <aside className="sidebar" aria-label="Calendar sidebar">
      <div className="create-control" ref={createControlRef} onKeyDown={handleCreateKeyDown}>
        <button
          className="create-button"
          type="button"
          aria-controls="create-menu"
          aria-expanded={isCreateMenuOpen}
          aria-haspopup="menu"
          onClick={() => setIsCreateMenuOpen((isOpen) => !isOpen)}
          ref={createButtonRef}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Create
          <svg className="create-button__chevron" viewBox="0 0 24 24" aria-hidden="true">
            <path d="m7 10 5 5 5-5" />
          </svg>
        </button>
        {isCreateMenuOpen && (
          <div className="create-menu" id="create-menu" role="menu" aria-label="Create">
            {CREATE_TYPES.map((item) => (
              <button key={item.value} className="create-menu__item" type="button" role="menuitem" onClick={() => selectCreateType(item.value)}>
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <section className="sidebar-section" aria-label="Mini calendar">
        <MiniCalendar
          displayMonth={displayMonth}
          selectedDate={selectedDate}
          onPreviousMonth={onPreviousMonth}
          onNextMonth={onNextMonth}
          onSelectDate={onSelectDate}
        />
      </section>

      <div className="sidebar__calendar-sections">
        <SidebarSection
          controls={<SectionControl icon="chevron-down" />}
          heading="My calendars"
          headingId="my-calendars-heading"
        >
          <CalendarList
            calendars={MY_CALENDARS}
            onToggleCalendar={onToggleCalendar}
            visibleCalendars={visibleCalendars}
          />
        </SidebarSection>

        <SidebarSection
          controls={(
            <>
              <SectionControl icon="plus" />
              <SectionControl icon="chevron-down" />
            </>
          )}
          heading="Other calendars"
          headingId="other-calendars-heading"
        >
          <CalendarList
            calendars={OTHER_CALENDARS}
            onToggleCalendar={onToggleCalendar}
            visibleCalendars={visibleCalendars}
          />
        </SidebarSection>
      </div>
    </aside>
  )
}

export default Sidebar

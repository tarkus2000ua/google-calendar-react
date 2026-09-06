import { useState } from 'react'
import AppHeader from './components/layout/AppHeader.jsx'
import CalendarCanvas from './components/layout/CalendarCanvas.jsx'
import Sidebar from './components/layout/Sidebar.jsx'
import EventDetailModal from './components/calendar/EventDetailModal.jsx'
import { addDays, addMonths, getStartOfMonth } from './utils/dateHelpers.js'
import './App.css'

function App() {
  const [displayDate, setDisplayDate] = useState(() => new Date())
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [eventTrigger, setEventTrigger] = useState(null)
  const [selectedEventChipId, setSelectedEventChipId] = useState(null)
  const [activeView, setActiveView] = useState('month')
  const [visibleCalendars, setVisibleCalendars] = useState(['Work', 'Personal', 'Holidays'])
  const displayMonth = getStartOfMonth(displayDate)

  function showToday() {
    setDisplayDate(new Date())
  }

  function showPreviousPeriod() {
    setDisplayDate((date) => {
      if (activeView === 'day' || activeView === 'schedule') return addDays(date, -1)
      if (activeView === 'week') return addDays(date, -7)

      return addMonths(date, -1)
    })
  }

  function showNextPeriod() {
    setDisplayDate((date) => {
      if (activeView === 'day' || activeView === 'schedule') return addDays(date, 1)
      if (activeView === 'week') return addDays(date, 7)

      return addMonths(date, 1)
    })
  }

  function showPreviousMonth() {
    setDisplayDate((date) => addMonths(date, -1))
  }

  function showNextMonth() {
    setDisplayDate((date) => addMonths(date, 1))
  }

  function selectDate(date) {
    setSelectedDate(date)
    setDisplayDate(date)
  }

  function toggleCalendar(calendarName) {
    setVisibleCalendars((calendars) => (
      calendars.includes(calendarName)
        ? calendars.filter((calendar) => calendar !== calendarName)
        : [...calendars, calendarName]
    ))
  }

  function showEventDetails(event, trigger, eventChipId) {
    setSelectedEvent(event)
    setEventTrigger(trigger)
    setSelectedEventChipId(eventChipId)
  }

  function closeEventDetails() {
    setSelectedEvent(null)
    setSelectedEventChipId(null)
  }

  return (
    <>
      <div className="calendar-app">
        <AppHeader
          activeView={activeView}
          displayDate={displayDate}
          onViewChange={setActiveView}
          onToday={showToday}
          onPreviousPeriod={showPreviousPeriod}
          onNextPeriod={showNextPeriod}
        />
        <div className="calendar-app__body">
          <Sidebar
            displayMonth={displayMonth}
            selectedDate={activeView === 'schedule' ? displayDate : selectedDate}
            onPreviousMonth={showPreviousMonth}
            onNextMonth={showNextMonth}
            onSelectDate={selectDate}
            onToggleCalendar={toggleCalendar}
            visibleCalendars={visibleCalendars}
          />
          <CalendarCanvas
            activeView={activeView}
            displayDate={displayDate}
            displayMonth={displayMonth}
            onSelectEvent={showEventDetails}
            selectedEventChipId={selectedEventChipId}
            visibleCalendars={visibleCalendars}
          />
        </div>
      </div>
      {selectedEvent && <EventDetailModal event={selectedEvent} onClose={closeEventDetails} trigger={eventTrigger} />}
    </>
  )
}

export default App

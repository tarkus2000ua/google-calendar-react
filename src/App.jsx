import { useState } from 'react'
import AppHeader from './components/layout/AppHeader.jsx'
import CalendarCanvas from './components/layout/CalendarCanvas.jsx'
import Sidebar from './components/layout/Sidebar.jsx'
import EventDetailModal from './components/calendar/EventDetailModal.jsx'
import CreateEventModal from './components/calendar/CreateEventModal.jsx'
import mockEvents from './data/mockEvents.js'
import { addDays, addMonths, getStartOfMonth } from './utils/dateHelpers.js'
import './App.css'

function createDraftEvent(date, { displayTime, minutesFromDay, reveal }) {
  const start = new Date(date)

  if (typeof minutesFromDay === 'number') {
    const roundedMinutes = Math.min(23 * 60 + 30, Math.max(0, Math.round(minutesFromDay / 30) * 30))
    start.setHours(Math.floor(roundedMinutes / 60), roundedMinutes % 60, 0, 0)
  } else {
    const now = new Date()
    start.setHours(now.getHours() + (now.getMinutes() >= 30 ? 1 : 0), 0, 0, 0)
  }

  const end = new Date(start)
  end.setHours(end.getHours() + 1)

  return { date: start, displayTime, end, reveal, start }
}

function App() {
  const [displayDate, setDisplayDate] = useState(() => new Date())
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [eventTrigger, setEventTrigger] = useState(null)
  const [selectedEventChipId, setSelectedEventChipId] = useState(null)
  const [events, setEvents] = useState(mockEvents)
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false)
  const [isCreateEventDocked, setIsCreateEventDocked] = useState(false)
  const [createEventTrigger, setCreateEventTrigger] = useState(null)
  const [createEventType, setCreateEventType] = useState('event')
  const [draftEvent, setDraftEvent] = useState(null)
  const [selectedDateTrigger, setSelectedDateTrigger] = useState(null)
  const [activeView, setActiveView] = useState('month')
  const [visibleCalendars, setVisibleCalendars] = useState(['Work', 'Personal', 'Holidays'])
  const displayMonth = getStartOfMonth(displayDate)

  function showToday() {
    setDisplayDate(new Date())
  }

  function showPreviousPeriod() {
    setDisplayDate((date) => {
      if (activeView === 'day' || activeView === 'schedule') return addDays(date, -1)
      if (activeView === 'four-days') return addDays(date, -4)
      if (activeView === 'week') return addDays(date, -7)

      return addMonths(date, -1)
    })
  }

  function showNextPeriod() {
    setDisplayDate((date) => {
      if (activeView === 'day' || activeView === 'schedule') return addDays(date, 1)
      if (activeView === 'four-days') return addDays(date, 4)
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

  function selectDate(date, trigger = null) {
    setSelectedDate(date)
    setSelectedDateTrigger(trigger)
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

  function openCreateEvent(trigger, type) {
    setCreateEventType(type)
    setIsCreateEventDocked(false)

    if (activeView === 'month' || activeView === 'week' || activeView === 'four-days' || activeView === 'day') {
      const draft = createDraftEvent(selectedDate ?? displayDate, {
        displayTime: true,
        reveal: activeView !== 'month',
      })

      setDraftEvent(draft)
      setCreateEventTrigger(null)
      setIsCreateEventOpen(false)
      return
    }

    setDraftEvent(null)
    setCreateEventTrigger(selectedDateTrigger ?? trigger)
    setIsCreateEventOpen(true)
  }

  function openCreateAtDate(date, trigger) {
    setSelectedDate(null)
    setSelectedDateTrigger(trigger)
    setCreateEventTrigger(null)
    setCreateEventType('event')
    setDraftEvent(createDraftEvent(date, { displayTime: false }))
    setIsCreateEventDocked(false)
    setIsCreateEventOpen(false)
  }

  function openCreateFromDraft(anchor) {
    setCreateEventTrigger(anchor)
    setIsCreateEventOpen(true)
  }

  function openCreateAtTime(date, minutesFromDay) {
    setSelectedDate(null)
    setCreateEventTrigger(null)
    setCreateEventType('event')
    setDraftEvent(createDraftEvent(date, { displayTime: true, minutesFromDay, reveal: false }))
    setIsCreateEventDocked(false)
    setIsCreateEventOpen(false)
  }

  function closeCreateEvent() {
    setIsCreateEventOpen(false)
    setIsCreateEventDocked(false)
    setDraftEvent(null)
  }

  function saveCreatedEvent(event) {
    setEvents((currentEvents) => [...currentEvents, event])
    closeCreateEvent()
  }

  return (
    <>
      <div className={`calendar-app${isCreateEventDocked ? ' calendar-app--composer-docked' : ''}`}>
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
            onCreate={openCreateEvent}
          />
          <CalendarCanvas
            activeView={activeView}
            displayDate={displayDate}
            displayMonth={displayMonth}
            events={events}
            onSelectDate={openCreateAtDate}
            onSelectTime={openCreateAtTime}
            onDraftAnchor={openCreateFromDraft}
            onSelectEvent={showEventDetails}
            draftEvent={draftEvent}
            selectedDate={selectedDate}
            selectedEventChipId={selectedEventChipId}
            visibleCalendars={visibleCalendars}
          />
        </div>
      </div>
      {selectedEvent && <EventDetailModal event={selectedEvent} onClose={closeEventDetails} trigger={eventTrigger} />}
      {isCreateEventOpen && (
        <CreateEventModal
          initialDate={draftEvent?.date ?? selectedDate ?? displayDate}
          initialStart={draftEvent?.start}
          initialType={createEventType}
          onClose={closeCreateEvent}
          onSave={saveCreatedEvent}
          trigger={createEventTrigger}
          isDocked={isCreateEventDocked}
          onToggleDocked={() => setIsCreateEventDocked((isDocked) => !isDocked)}
        />
      )}
    </>
  )
}

export default App

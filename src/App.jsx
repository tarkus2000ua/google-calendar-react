import { useState } from 'react'
import { Navigate, Route, Routes, useNavigate, useParams } from 'react-router'
import AppHeader from './components/layout/AppHeader.jsx'
import CalendarCanvas from './components/layout/CalendarCanvas.jsx'
import CreateControl from './components/layout/CreateControl.jsx'
import Sidebar from './components/layout/Sidebar.jsx'
import EventDetailModal from './components/calendar/EventDetailModal.jsx'
import CreateEventModal from './components/calendar/CreateEventModal.jsx'
import YearDateModal from './components/calendar/YearDateModal.jsx'
import mockEvents from './data/mockEvents.js'
import { getTodayCalendarPath, parseCalendarRoute, toCalendarPath } from './utils/calendarRoutes.js'
import { addDays, addMonths, getStartOfMonth } from './utils/dateHelpers.js'
import './App.css'

const DEFAULT_DISPLAY_OPTIONS = {
  showCompletedTasks: true,
  showDeclinedEvents: true,
  showWeekends: true,
}

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

function CalendarRoute() {
  const params = useParams()
  const calendarRoute = parseCalendarRoute(params)

  if (!calendarRoute) {
    return <Navigate replace to={getTodayCalendarPath()} />
  }

  return <CalendarApp {...calendarRoute} />
}

function CalendarApp({ activeView, displayDate }) {
  const navigate = useNavigate()
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [eventTrigger, setEventTrigger] = useState(null)
  const [selectedEventChipId, setSelectedEventChipId] = useState(null)
  const [eventDetailPlacement, setEventDetailPlacement] = useState('anchored')
  const [selectedYearDate, setSelectedYearDate] = useState(null)
  const [yearDateTrigger, setYearDateTrigger] = useState(null)
  const [events, setEvents] = useState(mockEvents)
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false)
  const [isCreateEventDocked, setIsCreateEventDocked] = useState(false)
  const [createEventTrigger, setCreateEventTrigger] = useState(null)
  const [createEventType, setCreateEventType] = useState('event')
  const [draftEvent, setDraftEvent] = useState(null)
  const [selectedDateTrigger, setSelectedDateTrigger] = useState(null)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [visibleCalendars, setVisibleCalendars] = useState(['Work', 'Personal', 'Holidays'])
  const [displayOptions, setDisplayOptions] = useState(DEFAULT_DISPLAY_OPTIONS)
  const displayMonth = getStartOfMonth(displayDate)
  const visibleEvents = events.filter((event) => (
    visibleCalendars.includes(event.calendar)
    && (displayOptions.showDeclinedEvents || event.status !== 'declined')
    && (displayOptions.showCompletedTasks || event.type !== 'task' || event.status !== 'completed')
  ))

  function showToday() {
    const today = new Date()

    setSelectedDate(today)
    navigate(toCalendarPath(activeView, today))
  }

  function showPreviousPeriod() {
    if (activeView === 'day' || activeView === 'schedule') {
      navigate(toCalendarPath(activeView, addDays(displayDate, -1)))
      return
    }

    if (activeView === 'four-days') {
      navigate(toCalendarPath(activeView, addDays(displayDate, -4)))
      return
    }

    if (activeView === 'week') {
      navigate(toCalendarPath(activeView, addDays(displayDate, -7)))
      return
    }

    if (activeView === 'year') {
      navigate(toCalendarPath(activeView, addMonths(displayDate, -12)))
      return
    }

    navigate(toCalendarPath(activeView, addMonths(displayDate, -1)))
  }

  function showNextPeriod() {
    if (activeView === 'day' || activeView === 'schedule') {
      navigate(toCalendarPath(activeView, addDays(displayDate, 1)))
      return
    }

    if (activeView === 'four-days') {
      navigate(toCalendarPath(activeView, addDays(displayDate, 4)))
      return
    }

    if (activeView === 'week') {
      navigate(toCalendarPath(activeView, addDays(displayDate, 7)))
      return
    }

    if (activeView === 'year') {
      navigate(toCalendarPath(activeView, addMonths(displayDate, 12)))
      return
    }

    navigate(toCalendarPath(activeView, addMonths(displayDate, 1)))
  }

  function showPreviousMonth() {
    navigate(toCalendarPath(activeView, addMonths(displayDate, -1)))
  }

  function showNextMonth() {
    navigate(toCalendarPath(activeView, addMonths(displayDate, 1)))
  }

  function selectDate(date, trigger = null) {
    setSelectedDate(date)
    setSelectedDateTrigger(trigger)
    navigate(toCalendarPath(activeView, date))
  }

  function selectYearDate(date, trigger) {
    setSelectedDate(date)
    setSelectedDateTrigger(trigger)
    setSelectedYearDate(date)
    setYearDateTrigger(trigger)
  }

  function closeYearDateModal() {
    setSelectedYearDate(null)
    setYearDateTrigger(null)
    setSelectedEvent(null)
    setSelectedEventChipId(null)
  }

  function openYearDateInDayView(date) {
    closeYearDateModal()
    navigate(toCalendarPath('day', date))
  }

  function changeView(view) {
    navigate(toCalendarPath(view, displayDate))
  }

  function toggleCalendar(calendarName) {
    setVisibleCalendars((calendars) => (
      calendars.includes(calendarName)
        ? calendars.filter((calendar) => calendar !== calendarName)
        : [...calendars, calendarName]
    ))
  }

  function toggleDisplayOption(option) {
    setDisplayOptions((options) => ({
      ...options,
      [option]: !options[option],
    }))
  }

  function showEventDetails(event, trigger, eventChipId) {
    closeYearDateModal()
    setSelectedEvent(event)
    setEventTrigger(trigger)
    setSelectedEventChipId(eventChipId)
    setEventDetailPlacement('anchored')
  }

  function showYearDateEventDetails(event, trigger, eventChipId) {
    setSelectedEvent(event)
    setEventTrigger(trigger)
    setSelectedEventChipId(eventChipId)
    setEventDetailPlacement('anchored')
  }

  function showSearchEventDetails(event) {
    closeYearDateModal()
    setSelectedEvent(event)
    setEventTrigger(null)
    setSelectedEventChipId(null)
    setEventDetailPlacement('centered')
  }

  function closeEventDetails() {
    setSelectedEvent(null)
    setSelectedEventChipId(null)
    setEventDetailPlacement('anchored')
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
      <div className={`calendar-app${isCreateEventDocked ? ' calendar-app--composer-docked' : ''}${isSidebarCollapsed ? ' calendar-app--sidebar-collapsed' : ''}`}>
        <AppHeader
          activeView={activeView}
          displayOptions={displayOptions}
          displayDate={displayDate}
          events={visibleEvents}
          isSidebarCollapsed={isSidebarCollapsed}
          onDisplayOptionToggle={toggleDisplayOption}
          onSearchResultSelect={showSearchEventDetails}
          onSidebarToggle={() => setIsSidebarCollapsed((isCollapsed) => !isCollapsed)}
          onViewChange={changeView}
          onToday={showToday}
          onPreviousPeriod={showPreviousPeriod}
          onNextPeriod={showNextPeriod}
        />
        <div className="calendar-app__body">
          {isSidebarCollapsed && !isCreateEventDocked && <CreateControl compact onCreate={openCreateEvent} />}
          <Sidebar
          displayMonth={displayMonth}
          isCollapsed={isSidebarCollapsed}
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
            events={visibleEvents}
            onSelectDate={openCreateAtDate}
            onSelectYearDate={selectYearDate}
            onSelectTime={openCreateAtTime}
            onDraftAnchor={openCreateFromDraft}
            onSelectEvent={showEventDetails}
            draftEvent={draftEvent}
            selectedDate={selectedDate}
            selectedEventChipId={selectedEventChipId}
            showWeekends={displayOptions.showWeekends}
          />
        </div>
      </div>
      {selectedEvent && <EventDetailModal event={selectedEvent} isCentered={eventDetailPlacement === 'centered'} onClose={closeEventDetails} trigger={eventTrigger} />}
      {selectedYearDate && (
        <YearDateModal
          date={selectedYearDate}
          events={visibleEvents}
          onClose={closeYearDateModal}
          onOpenDay={openYearDateInDayView}
          onSelectEvent={showYearDateEventDetails}
          trigger={yearDateTrigger}
        />
      )}
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

function App() {
  return (
    <Routes>
      <Route path="/calendar/:view/:year/:month/:day" element={<CalendarRoute />} />
      <Route path="*" element={<Navigate replace to={getTodayCalendarPath()} />} />
    </Routes>
  )
}

export default App

import { useState } from 'react'
import AppHeader from './components/layout/AppHeader.jsx'
import CalendarCanvas from './components/layout/CalendarCanvas.jsx'
import Sidebar from './components/layout/Sidebar.jsx'
import { addDays, addMonths, getStartOfMonth } from './utils/dateHelpers.js'
import './App.css'

function App() {
  const [displayDate, setDisplayDate] = useState(() => new Date())
  const [selectedDate, setSelectedDate] = useState(null)
  const [activeView, setActiveView] = useState('month')
  const displayMonth = getStartOfMonth(displayDate)

  function showToday() {
    setDisplayDate(new Date())
  }

  function showPreviousPeriod() {
    setDisplayDate((date) => (activeView === 'week' ? addDays(date, -7) : addMonths(date, -1)))
  }

  function showNextPeriod() {
    setDisplayDate((date) => (activeView === 'week' ? addDays(date, 7) : addMonths(date, 1)))
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

  return (
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
          selectedDate={selectedDate}
          onPreviousMonth={showPreviousMonth}
          onNextMonth={showNextMonth}
          onSelectDate={selectDate}
        />
        <CalendarCanvas activeView={activeView} displayDate={displayDate} displayMonth={displayMonth} />
      </div>
    </div>
  )
}

export default App

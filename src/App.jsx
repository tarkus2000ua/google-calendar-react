import { useState } from 'react'
import AppHeader from './components/layout/AppHeader.jsx'
import CalendarCanvas from './components/layout/CalendarCanvas.jsx'
import Sidebar from './components/layout/Sidebar.jsx'
import { addMonths, getStartOfMonth } from './utils/dateHelpers.js'
import './App.css'

function App() {
  const [displayMonth, setDisplayMonth] = useState(() => getStartOfMonth(new Date()))
  const [selectedDate, setSelectedDate] = useState(null)
  const [activeView, setActiveView] = useState('month')

  function showToday() {
    setDisplayMonth(getStartOfMonth(new Date()))
  }

  function showPreviousMonth() {
    setDisplayMonth((month) => addMonths(month, -1))
  }

  function showNextMonth() {
    setDisplayMonth((month) => addMonths(month, 1))
  }

  function selectDate(date) {
    setSelectedDate(date)
    setDisplayMonth(getStartOfMonth(date))
  }

  return (
    <div className="calendar-app">
      <AppHeader
        activeView={activeView}
        displayMonth={displayMonth}
        onViewChange={setActiveView}
        onToday={showToday}
        onPreviousMonth={showPreviousMonth}
        onNextMonth={showNextMonth}
      />
      <div className="calendar-app__body">
        <Sidebar
          displayMonth={displayMonth}
          selectedDate={selectedDate}
          onPreviousMonth={showPreviousMonth}
          onNextMonth={showNextMonth}
          onSelectDate={selectDate}
        />
        <CalendarCanvas activeView={activeView} displayMonth={displayMonth} />
      </div>
    </div>
  )
}

export default App

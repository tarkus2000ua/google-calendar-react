import { useState } from 'react'
import AppHeader from './components/layout/AppHeader.jsx'
import CalendarCanvas from './components/layout/CalendarCanvas.jsx'
import Sidebar from './components/layout/Sidebar.jsx'
import { addMonths, getStartOfMonth } from './utils/dateHelpers.js'
import './App.css'

function App() {
  const [displayMonth, setDisplayMonth] = useState(() => getStartOfMonth(new Date()))

  function showToday() {
    setDisplayMonth(getStartOfMonth(new Date()))
  }

  function showPreviousMonth() {
    setDisplayMonth((month) => addMonths(month, -1))
  }

  function showNextMonth() {
    setDisplayMonth((month) => addMonths(month, 1))
  }

  return (
    <div className="calendar-app">
      <AppHeader
        displayMonth={displayMonth}
        onToday={showToday}
        onPreviousMonth={showPreviousMonth}
        onNextMonth={showNextMonth}
      />
      <div className="calendar-app__body">
        <Sidebar />
        <CalendarCanvas displayMonth={displayMonth} />
      </div>
    </div>
  )
}

export default App

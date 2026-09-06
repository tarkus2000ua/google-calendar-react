import AppHeader from './components/layout/AppHeader.jsx'
import CalendarCanvas from './components/layout/CalendarCanvas.jsx'
import Sidebar from './components/layout/Sidebar.jsx'
import './App.css'

function App() {
  return (
    <div className="calendar-app">
      <AppHeader />
      <div className="calendar-app__body">
        <Sidebar />
        <CalendarCanvas />
      </div>
    </div>
  )
}

export default App

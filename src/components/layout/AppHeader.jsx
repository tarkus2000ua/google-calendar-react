import { formatMonthYear } from '../../utils/dateHelpers.js'
import ViewSelector from '../calendar/ViewSelector.jsx'
import IconButton from '../ui/IconButton.jsx'

function AppHeader({ activeView, displayMonth, onViewChange, onToday, onPreviousMonth, onNextMonth }) {
  return (
    <header className="app-header">
      <div className="app-header__identity">
        <IconButton ariaLabel="Open navigation" icon="menu" />
        <div className="calendar-brand" aria-label="Calendar">
          <span className="calendar-brand__icon" aria-hidden="true">31</span>
          <span className="calendar-brand__name">Calendar</span>
        </div>
      </div>

      <div className="app-header__navigation" aria-label="Calendar navigation">
        <button className="today-button" type="button" onClick={onToday}>Today</button>
        <div className="date-navigation">
          <IconButton ariaLabel="Previous month" icon="chevron-left" onClick={onPreviousMonth} />
          <IconButton ariaLabel="Next month" icon="chevron-right" onClick={onNextMonth} />
        </div>
        <p className="current-period">{formatMonthYear(displayMonth)}</p>
      </div>

      <ViewSelector activeView={activeView} onViewChange={onViewChange} />

      <div className="app-header__utilities">
        <IconButton ariaLabel="Search" icon="search" />
        <IconButton ariaLabel="Help" icon="help" />
        <IconButton ariaLabel="Settings" icon="settings" />
        <button className="account-button" type="button" aria-label="Google Account">AM</button>
      </div>
    </header>
  )
}

export default AppHeader

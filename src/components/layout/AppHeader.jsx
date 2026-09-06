import { formatMonthYear } from '../../utils/dateHelpers.js'

function AppHeader({ displayMonth, onToday, onPreviousMonth, onNextMonth }) {
  return (
    <header className="app-header">
      <div className="app-header__identity">
        <button className="icon-button" type="button" aria-label="Open navigation">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>
        <div className="calendar-brand" aria-label="Calendar">
          <span className="calendar-brand__icon" aria-hidden="true">31</span>
          <span className="calendar-brand__name">Calendar</span>
        </div>
      </div>

      <div className="app-header__navigation" aria-label="Calendar navigation">
        <button className="today-button" type="button" onClick={onToday}>Today</button>
        <div className="date-navigation">
          <button className="icon-button" type="button" aria-label="Previous month" onClick={onPreviousMonth}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="m14.5 5-7 7 7 7" />
            </svg>
          </button>
          <button className="icon-button" type="button" aria-label="Next month" onClick={onNextMonth}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="m9.5 5 7 7-7 7" />
            </svg>
          </button>
        </div>
        <p className="current-period">{formatMonthYear(displayMonth)}</p>
      </div>

      <div className="app-header__utilities">
        <button className="icon-button" type="button" aria-label="Search">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="10.8" cy="10.8" r="5.8" />
            <path d="m15.2 15.2 4.3 4.3" />
          </svg>
        </button>
        <button className="icon-button" type="button" aria-label="Help">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="12" r="8" />
            <path d="M9.8 9.4a2.4 2.4 0 1 1 3.9 1.9c-1 .8-1.7 1.3-1.7 2.7M12 16.6h.01" />
          </svg>
        </button>
        <button className="icon-button" type="button" aria-label="Settings">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="12" r="2.8" />
            <path d="M19 13.4v-2.8l-2-.6a5.8 5.8 0 0 0-.7-1.5l1-1.8-2-2-1.8 1a5.8 5.8 0 0 0-1.5-.7L11.4 3H8.6L8 5a5.8 5.8 0 0 0-1.5.7l-1.8-1-2 2 1 1.8a5.8 5.8 0 0 0-.7 1.5l-2 .6v2.8l2 .6c.2.5.4 1 .7 1.5l-1 1.8 2 2 1.8-1c.5.3 1 .5 1.5.7l.6 2h2.8l.6-2c.5-.2 1-.4 1.5-.7l1.8 1 2-2-1-1.8c.3-.5.5-1 .7-1.5l2-.6Z" />
          </svg>
        </button>
        <button className="account-button" type="button" aria-label="Google Account">AM</button>
      </div>
    </header>
  )
}

export default AppHeader

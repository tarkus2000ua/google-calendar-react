import {
  addDays,
  addMonths,
  formatMonthYear,
  formatWeekRange,
  startOfDay,
} from '../../utils/dateHelpers.js'
import ViewSelector from '../calendar/ViewSelector.jsx'
import IconButton from '../ui/IconButton.jsx'

function AppHeader({ activeView, displayDate, onViewChange, onToday, onPreviousPeriod, onNextPeriod }) {
  const isDayView = activeView === 'day'
  const isWeekView = activeView === 'week'
  const isFourDayView = activeView === 'four-days'
  const isScheduleView = activeView === 'schedule'
  const isYearView = activeView === 'year'
  const periodLabel = isDayView
    ? displayDate.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
    : isWeekView
      ? formatWeekRange(displayDate)
      : isFourDayView
        ? formatFourDayRange(displayDate)
      : isScheduleView
        ? formatScheduleRange(displayDate)
        : isYearView
          ? String(displayDate.getFullYear())
        : formatMonthYear(displayDate)
  const periodUnit = isDayView || isScheduleView ? 'day' : isWeekView ? 'week' : isFourDayView ? '4 days' : isYearView ? 'year' : 'month'
  const previousLabel = `Previous ${periodUnit}`
  const nextLabel = `Next ${periodUnit}`

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
          <IconButton ariaLabel={previousLabel} icon="chevron-left" onClick={onPreviousPeriod} />
          <IconButton ariaLabel={nextLabel} icon="chevron-right" onClick={onNextPeriod} />
        </div>
        <p className="current-period">{periodLabel}</p>
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

function formatScheduleRange(value) {
  const rangeStart = startOfDay(value)
  const rangeEnd = addDays(addMonths(rangeStart, 6), -1)

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    year: 'numeric',
  }).formatRange(rangeStart, rangeEnd)
}

function formatFourDayRange(value) {
  const rangeStart = startOfDay(value)
  const rangeEnd = addDays(rangeStart, 3)

  return new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).formatRange(rangeStart, rangeEnd)
}

export default AppHeader

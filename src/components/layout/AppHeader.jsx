import {
  addDays,
  addMonths,
  formatMonthYear,
  formatWeekRange,
  startOfDay,
} from '../../utils/dateHelpers.js'
import { useState } from 'react'
import CalendarSearch from './CalendarSearch.jsx'
import ViewSelector from '../calendar/ViewSelector.jsx'
import IconButton from '../ui/IconButton.jsx'

function AppHeader({ activeView, displayDate, displayOptions, events, isSidebarCollapsed, onDisplayOptionToggle, onSearchResultSelect, onSidebarToggle, onViewChange, onToday, onPreviousPeriod, onNextPeriod }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const todayDay = new Date().getDate()
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
        <IconButton
          ariaControls="calendar-sidebar"
          ariaExpanded={!isSidebarCollapsed}
          ariaLabel={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          icon="menu"
          onClick={onSidebarToggle}
        />
        <div className="calendar-brand" aria-label="Calendar">
          <span className="calendar-brand__icon" aria-hidden="true">{todayDay}</span>
          <span className="calendar-brand__name">Calendar</span>
        </div>
      </div>

      <div className="app-header__navigation" aria-label="Calendar navigation">
        {isSearchOpen ? (
          <CalendarSearch
            events={events}
            onClose={() => setIsSearchOpen(false)}
            onSelectEvent={onSearchResultSelect}
          />
        ) : (
          <>
            <button className="today-button" type="button" onClick={onToday}>Today</button>
            <div className="date-navigation">
              <IconButton ariaLabel={previousLabel} icon="chevron-left" onClick={onPreviousPeriod} />
              <IconButton ariaLabel={nextLabel} icon="chevron-right" onClick={onNextPeriod} />
            </div>
            <p className="current-period">{periodLabel}</p>
          </>
        )}
      </div>

      <ViewSelector activeView={activeView} displayOptions={displayOptions} onDisplayOptionToggle={onDisplayOptionToggle} onViewChange={onViewChange} />

      <div className="app-header__utilities">
        {!isSearchOpen && <IconButton ariaLabel="Search" className="app-header__search-button" icon="search" onClick={() => setIsSearchOpen(true)} />}
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

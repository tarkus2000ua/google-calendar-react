const URL_VIEW_TO_INTERNAL_VIEW = Object.freeze({
  month: 'month',
  week: 'week',
  day: 'day',
  '4day': 'four-days',
  agenda: 'schedule',
  year: 'year',
})

const INTERNAL_VIEW_TO_URL_VIEW = Object.freeze({
  month: 'month',
  week: 'week',
  day: 'day',
  'four-days': '4day',
  schedule: 'agenda',
  year: 'year',
})

const YEAR_PATTERN = /^\d{4}$/
const MONTH_PATTERN = /^(0[1-9]|1[0-2])$/
const DAY_PATTERN = /^(0[1-9]|[12]\d|3[01])$/

function parseCalendarRoute({ day, month, view, year }) {
  if (!Object.hasOwn(URL_VIEW_TO_INTERNAL_VIEW, view)
    || !YEAR_PATTERN.test(year ?? '')
    || !MONTH_PATTERN.test(month ?? '')
    || !DAY_PATTERN.test(day ?? '')) {
    return null
  }

  const date = new Date(0)
  const routeYear = Number(year)
  const routeMonth = Number(month)
  const routeDay = Number(day)

  date.setFullYear(routeYear, routeMonth - 1, routeDay)
  date.setHours(0, 0, 0, 0)

  if (date.getFullYear() !== routeYear
    || date.getMonth() !== routeMonth - 1
    || date.getDate() !== routeDay) {
    return null
  }

  return {
    displayDate: date,
    activeView: URL_VIEW_TO_INTERNAL_VIEW[view],
  }
}

function toCalendarPath(activeView, value) {
  const urlView = INTERNAL_VIEW_TO_URL_VIEW[activeView]

  if (!urlView || !(value instanceof Date) || Number.isNaN(value.getTime())) {
    throw new TypeError('Expected a supported calendar view and valid Date.')
  }

  const year = String(value.getFullYear()).padStart(4, '0')
  const month = String(value.getMonth() + 1).padStart(2, '0')
  const day = String(value.getDate()).padStart(2, '0')

  return `/calendar/${urlView}/${year}/${month}/${day}`
}

function getTodayCalendarPath() {
  return toCalendarPath('month', new Date())
}

export {
  getTodayCalendarPath,
  parseCalendarRoute,
  toCalendarPath,
}

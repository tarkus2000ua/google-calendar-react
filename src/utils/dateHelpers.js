const DATE_KEY_PATTERN = /^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{1,3}))?)?)?$/

function cloneDate(date) {
  return new Date(date.getTime())
}

function startOfDay(date) {
  const result = cloneDate(date)
  result.setHours(0, 0, 0, 0)
  return result
}

function parseLocalDate(value) {
  if (value instanceof Date) {
    return cloneDate(value)
  }

  const match = typeof value === 'string' ? value.match(DATE_KEY_PATTERN) : null

  if (!match) {
    throw new TypeError('Expected a local ISO date string or Date instance.')
  }

  const [, year, month, day, hours = '0', minutes = '0', seconds = '0', milliseconds = '0'] = match

  return new Date(
    Number(year),
    Number(month) - 1,
    Number(day),
    Number(hours),
    Number(minutes),
    Number(seconds),
    Number(milliseconds.padEnd(3, '0')),
  )
}

function toDateKey(value) {
  const date = parseLocalDate(value)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function compareDates(left, right) {
  const leftTime = startOfDay(parseLocalDate(left)).getTime()
  const rightTime = startOfDay(parseLocalDate(right)).getTime()

  return Math.sign(leftTime - rightTime)
}

function isSameDay(left, right) {
  return compareDates(left, right) === 0
}

function isToday(value) {
  return isSameDay(value, new Date())
}

function isSameMonth(left, right) {
  const leftDate = parseLocalDate(left)
  const rightDate = parseLocalDate(right)

  return leftDate.getFullYear() === rightDate.getFullYear()
    && leftDate.getMonth() === rightDate.getMonth()
}

function addDays(value, amount) {
  const date = parseLocalDate(value)
  date.setDate(date.getDate() + amount)
  return date
}

function addMonths(value, amount) {
  const date = parseLocalDate(value)
  const day = date.getDate()

  date.setDate(1)
  date.setMonth(date.getMonth() + amount)
  date.setDate(Math.min(day, getEndOfMonth(date).getDate()))

  return date
}

function getStartOfWeek(value) {
  const date = startOfDay(parseLocalDate(value))
  date.setDate(date.getDate() - date.getDay())
  return date
}

function getEndOfWeek(value) {
  return addDays(getStartOfWeek(value), 6)
}

function getStartOfMonth(value) {
  const date = startOfDay(parseLocalDate(value))
  date.setDate(1)
  return date
}

function getEndOfMonth(value) {
  const date = getStartOfMonth(value)
  date.setMonth(date.getMonth() + 1, 0)
  return date
}

function getMonthGridDates(value) {
  const gridStart = getStartOfWeek(getStartOfMonth(value))
  const gridEnd = getEndOfWeek(getEndOfMonth(value))
  const dates = []

  for (let date = gridStart; date <= gridEnd; date = addDays(date, 1)) {
    dates.push(date)
  }

  return dates
}

function isDateInRange(value, start, end) {
  return compareDates(value, start) >= 0 && compareDates(value, end) <= 0
}

function formatMonthYear(value, locale = 'en-US') {
  return new Intl.DateTimeFormat(locale, {
    month: 'long',
    year: 'numeric',
  }).format(parseLocalDate(value))
}

function formatWeekRange(value, locale = 'en-US') {
  const weekStart = getStartOfWeek(value)
  const weekEnd = getEndOfWeek(value)

  return new Intl.DateTimeFormat(locale, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).formatRange(weekStart, weekEnd)
}

export {
  addDays,
  addMonths,
  compareDates,
  formatMonthYear,
  formatWeekRange,
  getEndOfMonth,
  getEndOfWeek,
  getMonthGridDates,
  getStartOfMonth,
  getStartOfWeek,
  isDateInRange,
  isSameDay,
  isSameMonth,
  isToday,
  parseLocalDate,
  startOfDay,
  toDateKey,
}

import { parseLocalDate } from '../../utils/dateHelpers.js'

function formatEventTime(value) {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(parseLocalDate(value))
}

function EventChip({ event, isPast }) {
  return (
    <div
      className={`month-view__event month-view__event--${event.color}${isPast ? ' month-view__event--past' : ''}`}
      title={event.title}
    >
      {!event.allDay && <span className="month-view__event-time">{formatEventTime(event.start)}</span>}
      <span className="month-view__event-title">{event.title}</span>
    </div>
  )
}

export default EventChip

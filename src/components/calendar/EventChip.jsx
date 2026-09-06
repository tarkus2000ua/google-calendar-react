import { parseLocalDate } from '../../utils/dateHelpers.js'

function formatEventTime(value) {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(parseLocalDate(value))
}

function EventChip({ event, eventChipId, isPast, isSelected, onSelectEvent }) {
  return (
    <button
      className={`month-view__event month-view__event--${event.color}${isPast ? ' month-view__event--past' : ''}${isSelected ? ' month-view__event--selected' : ''}`}
      type="button"
      aria-label={`Open details for ${event.title}`}
      data-event-chip="true"
      title={event.title}
      onClick={(clickEvent) => onSelectEvent(event, clickEvent.currentTarget, eventChipId)}
    >
      {!event.allDay && <span className="month-view__event-time">{formatEventTime(event.start)}</span>}
      <span className="month-view__event-title">{event.title}</span>
    </button>
  )
}

export default EventChip

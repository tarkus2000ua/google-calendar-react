import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import { parseLocalDate, toDateKey } from '../../utils/dateHelpers.js'
import '../../styles/create-event-modal.css'

const CALENDAR_COLORS = {
  Holidays: 'green',
  Personal: 'red',
  Work: 'blue',
}

const EVENT_TYPES = [
  { label: 'Event', value: 'event' },
  { label: 'Task', value: 'task' },
  { label: 'Appointment schedule', value: 'appointment' },
]

const VIEWPORT_PADDING = 12
const POPOVER_GAP = 12

function padTimePart(value) {
  return String(value).padStart(2, '0')
}

function getInitialForm(date, type, initialStart) {
  const start = initialStart ? new Date(initialStart) : new Date(date)

  if (!initialStart) {
    const now = new Date()
    start.setHours(now.getHours() + (now.getMinutes() >= 30 ? 1 : 0), 0, 0, 0)
  }

  const end = new Date(start)
  end.setHours(end.getHours() + 1)

  return {
    allDay: false,
    calendar: 'Work',
    endDate: toDateKey(end),
    endTime: `${padTimePart(end.getHours())}:${padTimePart(end.getMinutes())}`,
    startDate: toDateKey(start),
    startTime: `${padTimePart(start.getHours())}:${padTimePart(start.getMinutes())}`,
    title: '',
    type,
  }
}

function createDateTime(date, time) {
  return `${date}T${time}`
}

function createEventId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `created-${crypto.randomUUID()}`
  }

  return `created-${Date.now()}-${Math.random().toString(36).slice(2)}`
}

function clamp(value, minimum, maximum) {
  return Math.min(Math.max(value, minimum), maximum)
}

function formatScheduleSummary(form) {
  const date = new Date(`${form.startDate}T00:00:00`)
  const dateLabel = Number.isNaN(date.getTime())
    ? form.startDate
    : new Intl.DateTimeFormat('en-US', { day: 'numeric', month: 'short', weekday: 'long' }).format(date)

  if (form.allDay) return `${dateLabel} · All day`

  return `${dateLabel} · ${form.startTime} – ${form.endTime}`
}

function getRangeError(form) {
  try {
    const start = parseLocalDate(createDateTime(form.startDate, form.allDay ? '00:00:00' : form.startTime))
    const end = parseLocalDate(createDateTime(form.endDate, form.allDay ? '23:59:59' : form.endTime))

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      return 'Enter valid start and end dates and times.'
    }

    if (end <= start) {
      return form.allDay
        ? 'The end date must be on or after the start date.'
        : 'The end must be after the start.'
    }
  } catch {
    return 'Enter valid start and end dates and times.'
  }

  return ''
}

function CreateEventModal({ initialDate, initialStart, initialType, isDocked, onClose, onSave, onToggleDocked, trigger }) {
  const [form, setForm] = useState(() => getInitialForm(initialDate, initialType, initialStart))
  const [errors, setErrors] = useState({ range: '', title: '' })
  const [isScheduleExpanded, setIsScheduleExpanded] = useState(false)
  const dialogRef = useRef(null)
  const titleInputRef = useRef(null)
  const rangeInputRef = useRef(null)
  const triggerRef = useRef(trigger)
  const hasDraggedRef = useRef(false)
  const dragOffsetRef = useRef(null)
  const titleId = useId()
  const titleErrorId = useId()
  const rangeErrorId = useId()
  const [position, setPosition] = useState(null)

  useEffect(() => {
    const restoreFocusTarget = triggerRef.current
    const focusFrame = window.requestAnimationFrame(() => titleInputRef.current?.focus())

    return () => {
      window.cancelAnimationFrame(focusFrame)
      restoreFocusTarget?.focus()
    }
  }, [])

  useLayoutEffect(() => {
    triggerRef.current = trigger

    function updatePosition() {
      if (isDocked) return

      const anchor = triggerRef.current?.getBoundingClientRect()
      const dialog = dialogRef.current?.getBoundingClientRect()

      if (!dialog) {
        setPosition(null)
        return
      }

      if (hasDraggedRef.current) {
        setPosition((currentPosition) => {
          if (!currentPosition) return currentPosition

          return {
            left: clamp(currentPosition.left, VIEWPORT_PADDING, Math.max(VIEWPORT_PADDING, window.innerWidth - dialog.width - VIEWPORT_PADDING)),
            top: clamp(currentPosition.top, VIEWPORT_PADDING, Math.max(VIEWPORT_PADDING, window.innerHeight - dialog.height - VIEWPORT_PADDING)),
          }
        })
        return
      }

      if (!anchor) {
        setPosition(null)
        return
      }

      const maximumLeft = Math.max(VIEWPORT_PADDING, window.innerWidth - dialog.width - VIEWPORT_PADDING)
      const maximumTop = Math.max(VIEWPORT_PADDING, window.innerHeight - dialog.height - VIEWPORT_PADDING)
      const hasRoomOnRight = window.innerWidth - anchor.right - POPOVER_GAP >= dialog.width
      const hasRoomOnLeft = anchor.left - POPOVER_GAP >= dialog.width
      const left = hasRoomOnRight || !hasRoomOnLeft
        ? anchor.right + POPOVER_GAP
        : anchor.left - dialog.width - POPOVER_GAP

      setPosition({
        left: clamp(left, VIEWPORT_PADDING, maximumLeft),
        top: clamp(anchor.top, VIEWPORT_PADDING, maximumTop),
      })
    }

    updatePosition()
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)

    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isDocked, trigger])

  function startDrag(event) {
    if (isDocked || event.button !== 0 || event.target.closest('button')) return

    const dialog = dialogRef.current?.getBoundingClientRect()
    if (!dialog) return

    event.currentTarget.setPointerCapture(event.pointerId)
    hasDraggedRef.current = true
    dragOffsetRef.current = {
      pointerId: event.pointerId,
      x: event.clientX - dialog.left,
      y: event.clientY - dialog.top,
    }
    setPosition({ left: dialog.left, top: dialog.top })
  }

  function moveDrag(event) {
    const dragOffset = dragOffsetRef.current
    const dialog = dialogRef.current?.getBoundingClientRect()

    if (!dragOffset || dragOffset.pointerId !== event.pointerId || !dialog) return

    setPosition({
      left: clamp(event.clientX - dragOffset.x, VIEWPORT_PADDING, Math.max(VIEWPORT_PADDING, window.innerWidth - dialog.width - VIEWPORT_PADDING)),
      top: clamp(event.clientY - dragOffset.y, VIEWPORT_PADDING, Math.max(VIEWPORT_PADDING, window.innerHeight - dialog.height - VIEWPORT_PADDING)),
    })
  }

  function endDrag(event) {
    if (dragOffsetRef.current?.pointerId !== event.pointerId) return

    dragOffsetRef.current = null
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
  }

  function updateField(field, value) {
    setForm((currentForm) => ({ ...currentForm, [field]: value }))
    setErrors((currentErrors) => ({
      ...currentErrors,
      range: field === 'startDate' || field === 'startTime' || field === 'endDate' || field === 'endTime' || field === 'allDay'
        ? ''
        : currentErrors.range,
      title: field === 'title' ? '' : currentErrors.title,
    }))
  }

  function selectType(type) {
    updateField('type', type)

    if (isDocked && type !== 'event') {
      onToggleDocked()
    }
  }

  function handleKeyDown(event) {
    if (event.key === 'Escape') {
      event.preventDefault()
      onClose()
      return
    }

    if (event.key !== 'Tab') return

    const focusableElements = dialogRef.current?.querySelectorAll(
      'button:not([disabled]), input:not([disabled]), select:not([disabled])',
    )

    if (!focusableElements?.length) return

    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault()
      lastElement.focus()
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault()
      firstElement.focus()
    }
  }

  function handleSubmit(event) {
    event.preventDefault()

    const titleError = form.title.trim() ? '' : 'Add a title for this event.'
    const rangeError = getRangeError(form)

    if (titleError || rangeError) {
      setErrors({ range: rangeError, title: titleError })
      if (rangeError) setIsScheduleExpanded(true)
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          if (titleError) {
            titleInputRef.current?.focus()
          } else {
            rangeInputRef.current?.focus()
          }
        })
      })
      return
    }

    onSave({
      allDay: form.allDay,
      calendar: form.calendar,
      color: CALENDAR_COLORS[form.calendar],
      end: createDateTime(form.endDate, form.allDay ? '23:59:59' : `${form.endTime}:00`),
      id: createEventId(),
      start: createDateTime(form.startDate, form.allDay ? '00:00:00' : `${form.startTime}:00`),
      title: form.title.trim(),
      type: form.type,
    })
  }

  return (
    <div
      className={`create-event-modal__backdrop${isDocked ? ' create-event-modal__backdrop--docked' : ''}`}
      onPointerDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <section
        className={`create-event-modal${isDocked ? ' create-event-modal--docked' : ''}`}
        role="dialog"
        aria-labelledby={titleId}
        aria-modal={isDocked ? undefined : 'true'}
        ref={dialogRef}
        onKeyDown={handleKeyDown}
        style={isDocked ? undefined : position ?? undefined}
      >
        <header
          className={`create-event-modal__header${isDocked ? '' : ' create-event-modal__header--draggable'}`}
          onPointerDown={startDrag}
          onPointerMove={moveDrag}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
        >
          {form.type === 'event' && (
            <button
              className="create-event-modal__dock"
              type="button"
              aria-label={isDocked ? 'Undock create event panel' : 'Dock create event to side panel'}
              title={isDocked ? 'Undock composer' : 'Dock to side panel'}
              onClick={onToggleDocked}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6 9h12M6 15h12" />
              </svg>
            </button>
          )}
          <h2 className="create-event-modal__dialog-title" id={titleId}>Create calendar item</h2>
          <button className="create-event-modal__close" type="button" aria-label="Close create event" onClick={onClose}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="m6 6 12 12M18 6 6 18" />
            </svg>
          </button>
        </header>

        <form className="create-event-modal__form" onSubmit={handleSubmit} noValidate>
          <div className="create-event-modal__field">
            <input
              aria-describedby={errors.title ? titleErrorId : undefined}
              aria-invalid={Boolean(errors.title)}
              aria-label="Title"
              id="event-title"
              onChange={(event) => updateField('title', event.target.value)}
              placeholder="Add title"
              ref={titleInputRef}
              type="text"
              value={form.title}
            />
            {errors.title && <p className="create-event-modal__error" id={titleErrorId} role="alert">{errors.title}</p>}
          </div>

          <div className="create-event-modal__types" role="tablist" aria-label="Item type">
            {EVENT_TYPES.map((item) => (
              <button
                aria-selected={form.type === item.value}
                className="create-event-modal__type"
                key={item.value}
                onClick={() => selectType(item.value)}
                role="tab"
                type="button"
              >
                {item.label}
              </button>
            ))}
          </div>

          <fieldset className="create-event-modal__schedule" aria-describedby={errors.range ? rangeErrorId : undefined}>
            <legend>When</legend>
            {isScheduleExpanded ? (
              <div className="create-event-modal__schedule-expanded">
                <div className="create-event-modal__date-row">
                  <span className="create-event-modal__field-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="7" /><path d="M12 8v4l2.8 1.8" /></svg>
                  </span>
                  <div className="create-event-modal__date-controls">
                    <input aria-label="Start date" id="event-start-date" onChange={(event) => updateField('startDate', event.target.value)} ref={rangeInputRef} type="date" value={form.startDate} />
                    {!form.allDay && <input aria-label="Start time" id="event-start-time" onChange={(event) => updateField('startTime', event.target.value)} type="time" value={form.startTime} />}
                    <span className="create-event-modal__range-separator" aria-hidden="true">–</span>
                    <input aria-label="End date" id="event-end-date" onChange={(event) => updateField('endDate', event.target.value)} type="date" value={form.endDate} />
                    {!form.allDay && <input aria-label="End time" id="event-end-time" onChange={(event) => updateField('endTime', event.target.value)} type="time" value={form.endTime} />}
                  </div>
                </div>
                {errors.range && <p className="create-event-modal__error" id={rangeErrorId} role="alert">{errors.range}</p>}
                <div className="create-event-modal__schedule-options">
                  <label className="create-event-modal__all-day" htmlFor="event-all-day">
                    <input
                      checked={form.allDay}
                      id="event-all-day"
                      onChange={(event) => updateField('allDay', event.target.checked)}
                      type="checkbox"
                    />
                    <span>All day</span>
                  </label>
                  <span className="create-event-modal__time-zone">Time zone</span>
                </div>
                <span className="create-event-modal__repeat" aria-label="Does not repeat">Does not repeat</span>
              </div>
            ) : (
              <button className="create-event-modal__schedule-summary" type="button" onClick={() => setIsScheduleExpanded(true)}>
                <span className="create-event-modal__field-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="7" /><path d="M12 8v4l2.8 1.8" /></svg>
                </span>
                <span>{formatScheduleSummary(form)}</span>
              </button>
            )}
          </fieldset>

          <div className="create-event-modal__calendar-row">
            <span className={`create-event-modal__calendar-dot create-event-modal__calendar-dot--${CALENDAR_COLORS[form.calendar]}`} aria-hidden="true" />
            <label htmlFor="event-calendar">Calendar</label>
            <select id="event-calendar" value={form.calendar} onChange={(event) => updateField('calendar', event.target.value)}>
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Holidays">Holidays</option>
            </select>
          </div>

          <footer className="create-event-modal__actions">
            <button className="create-event-modal__cancel" type="button" onClick={onClose}>Cancel</button>
            <button className="create-event-modal__save" type="submit">Save</button>
          </footer>
        </form>
      </section>
    </div>
  )
}

export default CreateEventModal

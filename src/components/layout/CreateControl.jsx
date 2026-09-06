import { useEffect, useId, useRef, useState } from 'react'

const CREATE_TYPES = [
  { label: 'Event', value: 'event' },
  { label: 'Task', value: 'task' },
  { label: 'Appointment schedule', value: 'appointment' },
]

function CreateControl({ compact = false, onCreate }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const controlRef = useRef(null)
  const createButtonRef = useRef(null)
  const menuId = useId()

  useEffect(() => {
    if (!isMenuOpen) return undefined

    function closeOnOutsidePointer(event) {
      if (!controlRef.current?.contains(event.target)) {
        setIsMenuOpen(false)
      }
    }

    document.addEventListener('pointerdown', closeOnOutsidePointer)

    return () => document.removeEventListener('pointerdown', closeOnOutsidePointer)
  }, [isMenuOpen])

  function selectCreateType(type) {
    setIsMenuOpen(false)
    onCreate(createButtonRef.current, type)
  }

  function handleKeyDown(event) {
    if (event.key !== 'Escape' || !isMenuOpen) return

    event.preventDefault()
    setIsMenuOpen(false)
    createButtonRef.current?.focus()
  }

  return (
    <div
      className={`create-control${compact ? ' create-control--compact' : ''}`}
      ref={controlRef}
      onKeyDown={handleKeyDown}
    >
      <button
        aria-controls={menuId}
        aria-expanded={isMenuOpen}
        aria-haspopup="menu"
        aria-label={compact ? 'Create' : undefined}
        className={`create-button${compact ? ' create-button--compact' : ''}`}
        type="button"
        onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
        ref={createButtonRef}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 5v14M5 12h14" />
        </svg>
        <span className="create-button__label">Create</span>
        <svg className="create-button__chevron" viewBox="0 0 24 24" aria-hidden="true">
          <path d="m7 10 5 5 5-5" />
        </svg>
      </button>
      {isMenuOpen && (
        <div className="create-menu" id={menuId} role="menu" aria-label="Create">
          {CREATE_TYPES.map((item) => (
            <button key={item.value} className="create-menu__item" type="button" role="menuitem" onClick={() => selectCreateType(item.value)}>
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default CreateControl

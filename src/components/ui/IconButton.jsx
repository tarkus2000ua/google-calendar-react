import icons from './icons.jsx'

function IconButton({ ariaControls, ariaExpanded, ariaLabel, className = '', icon, onClick }) {
  return (
    <button
      aria-controls={ariaControls}
      aria-expanded={ariaExpanded}
      aria-label={ariaLabel}
      className={`icon-button${className ? ` ${className}` : ''}`}
      type="button"
      onClick={onClick}
    >
      {icons[icon]}
    </button>
  )
}

export default IconButton

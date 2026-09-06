import icons from './icons.jsx'

function IconButton({ ariaLabel, icon, onClick }) {
  return (
    <button className="icon-button" type="button" aria-label={ariaLabel} onClick={onClick}>
      {icons[icon]}
    </button>
  )
}

export default IconButton

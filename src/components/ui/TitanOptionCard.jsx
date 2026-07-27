function TitanOptionCard({
  children,
  selected = false,
  disabled = false,
  className = '',
  onClick,
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      aria-pressed={selected}
      onClick={onClick}
      className={[
        'titan-option-card',
        selected ? 'titan-option-card--selected' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <span className="titan-option-card__indicator" aria-hidden="true">
        {selected ? '✓' : ''}
      </span>

      <span className="titan-option-card__label">
        {children}
      </span>
    </button>
  )
}

export default TitanOptionCard